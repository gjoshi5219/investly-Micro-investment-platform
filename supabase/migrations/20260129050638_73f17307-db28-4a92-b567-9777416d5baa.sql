-- Fix 1: Add CHECK constraints for server-side input validation

-- Investment amount validation (protect against negative/excessive amounts)
ALTER TABLE public.investments ADD CONSTRAINT investments_amount_range 
  CHECK (amount > 0 AND amount <= 10000000);

-- Business validation (ensure realistic business parameters)
ALTER TABLE public.businesses ADD CONSTRAINT businesses_roi_range 
  CHECK (roi_percentage > 0 AND roi_percentage <= 100);
ALTER TABLE public.businesses ADD CONSTRAINT businesses_funding_range 
  CHECK (funding_goal >= 1000 AND funding_goal <= 100000000);
ALTER TABLE public.businesses ADD CONSTRAINT businesses_duration_range 
  CHECK (duration_months >= 1 AND duration_months <= 60);

-- Text length limits (prevent database bloat)
ALTER TABLE public.profiles ADD CONSTRAINT profiles_name_length 
  CHECK (full_name IS NULL OR LENGTH(full_name) <= 100);
ALTER TABLE public.profiles ADD CONSTRAINT profiles_bio_length 
  CHECK (bio IS NULL OR LENGTH(bio) <= 2000);
ALTER TABLE public.businesses ADD CONSTRAINT businesses_name_length 
  CHECK (LENGTH(name) <= 100);
ALTER TABLE public.businesses ADD CONSTRAINT businesses_desc_length 
  CHECK (LENGTH(description) <= 1000);
ALTER TABLE public.businesses ADD CONSTRAINT businesses_detail_length 
  CHECK (detailed_description IS NULL OR LENGTH(detailed_description) <= 5000);

-- Fix 2: Add triggers to handle investment updates and deletes for data consistency
-- Create function to handle UPDATE and DELETE on investments
CREATE OR REPLACE FUNCTION public.adjust_business_raised_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    UPDATE public.businesses 
    SET amount_raised = amount_raised - OLD.amount,
        updated_at = now()
    WHERE id = OLD.business_id;
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    -- Only adjust if amount changed
    IF (OLD.amount != NEW.amount) THEN
      UPDATE public.businesses 
      SET amount_raised = amount_raised - OLD.amount + NEW.amount,
          updated_at = now()
      WHERE id = NEW.business_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for UPDATE and DELETE operations
CREATE TRIGGER on_investment_updated
  AFTER UPDATE ON public.investments
  FOR EACH ROW
  EXECUTE FUNCTION public.adjust_business_raised_amount();

CREATE TRIGGER on_investment_deleted
  AFTER DELETE ON public.investments
  FOR EACH ROW
  EXECUTE FUNCTION public.adjust_business_raised_amount();