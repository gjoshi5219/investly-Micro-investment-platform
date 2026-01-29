import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingCard } from "@/components/ui/floating-card";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sanitizeError } from "@/lib/error-utils";
import { z } from "zod";

const businessSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(20, "Description must be at least 20 characters").max(500),
  detailedDescription: z.string().max(2000).optional(),
  roiPercentage: z.number().min(1).max(100),
  riskLevel: z.enum(["Low", "Medium", "High"]),
  durationMonths: z.number().min(1).max(60),
  fundingGoal: z.number().min(1000),
});

const categories = [
  "Food & Beverage",
  "Sustainability",
  "Health & Wellness",
  "Technology",
  "Retail",
  "Services",
];

export default function ListBusiness() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    detailedDescription: "",
    roiPercentage: "",
    riskLevel: "",
    durationMonths: "",
    fundingGoal: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to list your business.",
      });
      navigate("/auth");
    }
  }, [user, authLoading, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = businessSchema.safeParse({
      name: formData.name,
      category: formData.category,
      description: formData.description,
      detailedDescription: formData.detailedDescription || undefined,
      roiPercentage: parseFloat(formData.roiPercentage) || 0,
      riskLevel: formData.riskLevel,
      durationMonths: parseInt(formData.durationMonths) || 0,
      fundingGoal: parseFloat(formData.fundingGoal) || 0,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("businesses").insert({
        owner_id: user.id,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        detailed_description: formData.detailedDescription || null,
        roi_percentage: parseFloat(formData.roiPercentage),
        risk_level: formData.riskLevel,
        duration_months: parseInt(formData.durationMonths),
        funding_goal: parseFloat(formData.fundingGoal),
      });

      if (error) throw error;

      toast({
        title: "Business listed!",
        description: "Your business is now live and ready for investments.",
      });
      navigate("/dashboard");
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: sanitizeError(error, "Failed to list business. Please try again."),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="noise-overlay" />
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container px-4 max-w-2xl">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">
              List Your Business
            </h1>
            <p className="text-muted-foreground mb-8">
              Share your business with our investor community and get the funding
              you need to grow.
            </p>

            <FloatingCard className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Business Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Bean & Bloom Coffee"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-card-elevated border-border"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="bg-card-elevated border-border">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">{errors.category}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Briefly describe your business and what makes it unique..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="bg-card-elevated border-border min-h-[100px]"
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Detailed Description */}
                <div className="space-y-2">
                  <Label htmlFor="detailedDescription">
                    Detailed Description (optional)
                  </Label>
                  <Textarea
                    id="detailedDescription"
                    placeholder="Provide more details about your growth plans, market opportunity, etc..."
                    value={formData.detailedDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        detailedDescription: e.target.value,
                      })
                    }
                    className="bg-card-elevated border-border min-h-[150px]"
                  />
                </div>

                {/* Investment Details Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* ROI */}
                  <div className="space-y-2">
                    <Label htmlFor="roi">Expected ROI (%) *</Label>
                    <Input
                      id="roi"
                      type="number"
                      placeholder="e.g., 15"
                      min="1"
                      max="100"
                      value={formData.roiPercentage}
                      onChange={(e) =>
                        setFormData({ ...formData, roiPercentage: e.target.value })
                      }
                      className="bg-card-elevated border-border"
                    />
                    {errors.roiPercentage && (
                      <p className="text-sm text-destructive">
                        {errors.roiPercentage}
                      </p>
                    )}
                  </div>

                  {/* Risk Level */}
                  <div className="space-y-2">
                    <Label htmlFor="risk">Risk Level *</Label>
                    <Select
                      value={formData.riskLevel}
                      onValueChange={(value) =>
                        setFormData({ ...formData, riskLevel: value })
                      }
                    >
                      <SelectTrigger className="bg-card-elevated border-border">
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.riskLevel && (
                      <p className="text-sm text-destructive">
                        {errors.riskLevel}
                      </p>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (months) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="e.g., 12"
                      min="1"
                      max="60"
                      value={formData.durationMonths}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          durationMonths: e.target.value,
                        })
                      }
                      className="bg-card-elevated border-border"
                    />
                    {errors.durationMonths && (
                      <p className="text-sm text-destructive">
                        {errors.durationMonths}
                      </p>
                    )}
                  </div>

                  {/* Funding Goal */}
                  <div className="space-y-2">
                    <Label htmlFor="goal">Funding Goal ($) *</Label>
                    <Input
                      id="goal"
                      type="number"
                      placeholder="e.g., 50000"
                      min="1000"
                      value={formData.fundingGoal}
                      onChange={(e) =>
                        setFormData({ ...formData, fundingGoal: e.target.value })
                      }
                      className="bg-card-elevated border-border"
                    />
                    {errors.fundingGoal && (
                      <p className="text-sm text-destructive">
                        {errors.fundingGoal}
                      </p>
                    )}
                  </div>
                </div>

                <MagneticButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "List My Business"}
                </MagneticButton>
              </form>
            </FloatingCard>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
