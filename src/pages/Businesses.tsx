import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingCard } from "@/components/ui/floating-card";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SectionWrapper, SectionHeader } from "@/components/ui/section-wrapper";
import { TrendingUp, Clock, Users, ArrowUpRight } from "lucide-react";
import { devError } from "@/lib/error-utils";

interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  roi_percentage: number;
  risk_level: string;
  duration_months: number;
  funding_goal: number;
  amount_raised: number;
  status: string;
}

const riskColors = {
  Low: "text-accent bg-accent/10 border-accent/30",
  Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  High: "text-destructive bg-destructive/10 border-destructive/30",
};

const categoryEmojis: Record<string, string> = {
  "Food & Beverage": "☕",
  "Sustainability": "♻️",
  "Health & Wellness": "🧘",
  "Technology": "💻",
  "Retail": "🛍️",
  "Services": "🛠️",
};

export default function Businesses() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBusinesses(data || []);
    } catch (error) {
      devError("Error fetching businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="noise-overlay" />
      <Navbar />

      <SectionWrapper className="pt-24">
        <div className="container px-4">
          <SectionHeader
            badge="Investment Opportunities"
            title="Browse all businesses"
            description="Discover vetted local businesses ready for your investment. Each opportunity is carefully reviewed for quality and growth potential."
          />

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse text-muted-foreground">
                Loading opportunities...
              </div>
            </div>
          ) : businesses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <FloatingCard className="max-w-md mx-auto p-8">
                <p className="text-muted-foreground mb-4">
                  No businesses are currently listed. Be the first to list your
                  business!
                </p>
                <MagneticButton
                  variant="primary"
                  onClick={() => navigate("/list-business")}
                >
                  List Your Business
                </MagneticButton>
              </FloatingCard>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {businesses.map((business, index) => (
                <FloatingCard
                  key={business.id}
                  delay={index}
                  intensity={0.5}
                  className="group overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/business/${business.id}`)}
                >
                  {/* Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-3xl">
                        {categoryEmojis[business.category] || "🏢"}
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${
                          riskColors[business.risk_level as keyof typeof riskColors]
                        }`}
                      >
                        {business.risk_level} Risk
                      </span>
                    </div>

                    <p className="text-xs text-primary font-medium mb-1">
                      {business.category}
                    </p>
                    <h3 className="text-xl font-semibold font-display mb-2">
                      {business.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {business.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="px-6 py-4 border-t border-border/50 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-accent mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-lg font-bold">
                          {business.roi_percentage}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Est. ROI</p>
                    </div>
                    <div className="text-center border-x border-border/50">
                      <div className="flex items-center justify-center gap-1 text-foreground mb-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-lg font-bold">
                          {business.duration_months}mo
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-foreground mb-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-lg font-bold">—</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Investors</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="px-6 py-4 border-t border-border/50">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        ${Number(business.amount_raised).toLocaleString()} raised
                      </span>
                      <span className="font-medium">
                        {Math.round(
                          (Number(business.amount_raised) /
                            Number(business.funding_goal)) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${
                            (Number(business.amount_raised) /
                              Number(business.funding_goal)) *
                            100
                          }%`,
                        }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Goal: ${Number(business.funding_goal).toLocaleString()}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="p-6 pt-4">
                    <button className="w-full py-3 rounded-xl bg-card-elevated border border-border text-foreground font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary">
                      View Details
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </FloatingCard>
              ))}
            </div>
          )}
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}
