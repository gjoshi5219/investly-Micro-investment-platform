import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingCard } from "@/components/ui/floating-card";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  Clock,
  Users,
  Shield,
  ArrowLeft,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Business {
  id: string;
  owner_id: string;
  name: string;
  category: string;
  description: string;
  detailed_description: string | null;
  image_url: string | null;
  roi_percentage: number;
  risk_level: string;
  duration_months: number;
  funding_goal: number;
  amount_raised: number;
  status: string;
  created_at: string;
}

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [investAmount, setInvestAmount] = useState("");
  const [investing, setInvesting] = useState(false);
  const [investorCount, setInvestorCount] = useState(0);

  useEffect(() => {
    if (id) {
      fetchBusiness();
    }
  }, [id]);

  const fetchBusiness = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setBusiness(data);
        
        // Get investor count
        const { count } = await supabase
          .from("investments")
          .select("*", { count: "exact", head: true })
          .eq("business_id", id);
        
        setInvestorCount(count || 0);
      }
    } catch (error) {
      console.error("Error fetching business:", error);
      toast({
        title: "Error",
        description: "Failed to load business details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to make an investment.",
      });
      navigate("/auth");
      return;
    }

    if (!business || !investAmount) return;

    const amount = parseFloat(investAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid investment amount.",
        variant: "destructive",
      });
      return;
    }

    if (business.owner_id === user.id) {
      toast({
        title: "Cannot invest",
        description: "You cannot invest in your own business.",
        variant: "destructive",
      });
      return;
    }

    setInvesting(true);
    try {
      const { error } = await supabase.from("investments").insert({
        investor_id: user.id,
        business_id: business.id,
        amount: amount,
      });

      if (error) throw error;

      toast({
        title: "Investment successful!",
        description: `You've invested $${amount.toLocaleString()} in ${business.name}.`,
      });

      // Refresh business data
      fetchBusiness();
      setInvestAmount("");
    } catch (error: any) {
      toast({
        title: "Investment failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setInvesting(false);
    }
  };

  const riskColors = {
    Low: "text-accent bg-accent/10 border-accent/30",
    Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    High: "text-destructive bg-destructive/10 border-destructive/30",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="pt-24 pb-20">
          <div className="container px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Business not found</h1>
            <MagneticButton variant="primary" onClick={() => navigate("/businesses")}>
              Browse Businesses
            </MagneticButton>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const progressPercentage = Math.min(
    100,
    (Number(business.amount_raised) / Number(business.funding_goal)) * 100
  );

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="noise-overlay" />
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container px-4">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-primary font-medium">
                      {business.category}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${
                        riskColors[business.risk_level as keyof typeof riskColors]
                      }`}
                    >
                      {business.risk_level} Risk
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold font-display">
                    {business.name}
                  </h1>
                </div>

                {/* Image placeholder */}
                <FloatingCard className="aspect-video mb-6 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                  <span className="text-6xl">
                    {business.category === "Food & Beverage"
                      ? "☕"
                      : business.category === "Sustainability"
                      ? "♻️"
                      : business.category === "Health & Wellness"
                      ? "🧘"
                      : "🏢"}
                  </span>
                </FloatingCard>

                {/* Description */}
                <FloatingCard className="p-6 mb-6">
                  <h2 className="text-xl font-bold font-display mb-4">
                    About this opportunity
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {business.description}
                  </p>
                  {business.detailed_description && (
                    <p className="text-muted-foreground leading-relaxed">
                      {business.detailed_description}
                    </p>
                  )}
                </FloatingCard>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FloatingCard className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-accent mb-1">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-xl font-bold">
                        {business.roi_percentage}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Est. ROI</p>
                  </FloatingCard>

                  <FloatingCard className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-foreground mb-1">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <span className="text-xl font-bold">
                        {business.duration_months}mo
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                  </FloatingCard>

                  <FloatingCard className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-foreground mb-1">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <span className="text-xl font-bold">{investorCount}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Investors</p>
                  </FloatingCard>

                  <FloatingCard className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-foreground mb-1">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                      <span className="text-xl font-bold">
                        {business.risk_level}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Risk Level</p>
                  </FloatingCard>
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Investment Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FloatingCard className="p-6 sticky top-24">
                  <h3 className="text-lg font-bold font-display mb-4">
                    Investment Details
                  </h3>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Raised</span>
                      <span className="font-medium">
                        {progressPercentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        ${Number(business.amount_raised).toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">
                        of ${Number(business.funding_goal).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Investment Form */}
                  {business.status === "active" && business.owner_id !== user?.id && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Investment Amount ($)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="amount"
                            type="number"
                            placeholder="500"
                            min="1"
                            value={investAmount}
                            onChange={(e) => setInvestAmount(e.target.value)}
                            className="bg-card-elevated border-border pl-9"
                          />
                        </div>
                      </div>

                      <MagneticButton
                        variant="primary"
                        size="lg"
                        className="w-full justify-center"
                        onClick={handleInvest}
                        disabled={investing || !investAmount}
                      >
                        {investing ? "Processing..." : "Invest Now"}
                      </MagneticButton>
                    </div>
                  )}

                  {business.owner_id === user?.id && (
                    <p className="text-center text-muted-foreground text-sm">
                      This is your business listing.
                    </p>
                  )}

                  {business.status !== "active" && (
                    <p className="text-center text-muted-foreground text-sm">
                      This opportunity is no longer accepting investments.
                    </p>
                  )}

                  {!user && (
                    <MagneticButton
                      variant="primary"
                      size="lg"
                      className="w-full justify-center"
                      onClick={() => navigate("/auth")}
                    >
                      Sign in to Invest
                    </MagneticButton>
                  )}
                </FloatingCard>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
