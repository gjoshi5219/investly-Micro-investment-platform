import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingCard } from "@/components/ui/floating-card";
import { MagneticButton } from "@/components/ui/magnetic-button";
import {
  TrendingUp,
  Briefcase,
  DollarSign,
  ArrowUpRight,
  Plus,
  User,
  LogOut,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { devError } from "@/lib/error-utils";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface Investment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  business: {
    id: string;
    name: string;
    category: string;
    roi_percentage: number;
  };
}

interface Business {
  id: string;
  name: string;
  category: string;
  roi_percentage: number;
  amount_raised: number;
  funding_goal: number;
  status: string;
}

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [myBusinesses, setMyBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch investments with business details
      const { data: investmentData } = await supabase
        .from("investments")
        .select(`
          id,
          amount,
          status,
          created_at,
          business:businesses(id, name, category, roi_percentage)
        `)
        .eq("investor_id", user.id)
        .order("created_at", { ascending: false });

      if (investmentData) {
        setInvestments(investmentData as unknown as Investment[]);
      }

      // Fetch my businesses
      const { data: businessData } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (businessData) {
        setMyBusinesses(businessData);
      }
    } catch (error) {
      devError("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

  const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const activeInvestments = investments.filter((inv) => inv.status === "active").length;

  if (authLoading || loading) {
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
        <div className="container px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold font-display"
              >
                Welcome back, {profile?.full_name || "Investor"}
              </motion.h1>
              <p className="text-muted-foreground mt-1">
                Here's your investment overview
              </p>
            </div>
            <div className="flex gap-3">
              <MagneticButton
                variant="outline"
                size="sm"
                onClick={() => navigate("/profile")}
              >
                <User className="w-4 h-4" />
                Profile
              </MagneticButton>
              <MagneticButton variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                Sign Out
              </MagneticButton>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <FloatingCard className="p-6" delay={0}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Invested</p>
                  <p className="text-2xl font-bold font-display">
                    ${totalInvested.toLocaleString()}
                  </p>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard className="p-6" delay={1}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    Active Investments
                  </p>
                  <p className="text-2xl font-bold font-display">
                    {activeInvestments}
                  </p>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard className="p-6" delay={2}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">My Businesses</p>
                  <p className="text-2xl font-bold font-display">
                    {myBusinesses.length}
                  </p>
                </div>
              </div>
            </FloatingCard>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mb-10">
            <MagneticButton
              variant="primary"
              size="md"
              onClick={() => navigate("/businesses")}
            >
              <TrendingUp className="w-4 h-4" />
              Browse Investments
            </MagneticButton>
            <MagneticButton
              variant="outline"
              size="md"
              onClick={() => navigate("/list-business")}
            >
              <Plus className="w-4 h-4" />
              List Your Business
            </MagneticButton>
          </div>

          {/* My Investments */}
          <section className="mb-12">
            <h2 className="text-xl font-bold font-display mb-4">
              My Investments
            </h2>
            {investments.length === 0 ? (
              <FloatingCard className="p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  You haven't made any investments yet.
                </p>
                <MagneticButton
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/businesses")}
                >
                  Start Investing
                </MagneticButton>
              </FloatingCard>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {investments.map((investment, index) => (
                  <FloatingCard
                    key={investment.id}
                    className="p-6 cursor-pointer"
                    delay={index}
                    onClick={() =>
                      navigate(`/business/${investment.business.id}`)
                    }
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-xs text-primary font-medium">
                          {investment.business.category}
                        </p>
                        <h3 className="font-semibold font-display">
                          {investment.business.name}
                        </h3>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          investment.status === "active"
                            ? "bg-accent/20 text-accent"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {investment.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-muted-foreground text-sm">Invested</p>
                        <p className="text-lg font-bold">
                          ${Number(investment.amount).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground text-sm">Est. ROI</p>
                        <p className="text-lg font-bold text-accent">
                          {investment.business.roi_percentage}%
                        </p>
                      </div>
                    </div>
                  </FloatingCard>
                ))}
              </div>
            )}
          </section>

          {/* My Businesses */}
          <section>
            <h2 className="text-xl font-bold font-display mb-4">
              My Businesses
            </h2>
            {myBusinesses.length === 0 ? (
              <FloatingCard className="p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  You haven't listed any businesses yet.
                </p>
                <MagneticButton
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/list-business")}
                >
                  List Your Business
                </MagneticButton>
              </FloatingCard>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myBusinesses.map((business, index) => (
                  <FloatingCard
                    key={business.id}
                    className="p-6 cursor-pointer"
                    delay={index}
                    onClick={() => navigate(`/business/${business.id}`)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-xs text-primary font-medium">
                          {business.category}
                        </p>
                        <h3 className="font-semibold font-display">
                          {business.name}
                        </h3>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          business.status === "active"
                            ? "bg-accent/20 text-accent"
                            : business.status === "funded"
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {business.status}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Raised</span>
                        <span>
                          {Math.round(
                            (Number(business.amount_raised) /
                              Number(business.funding_goal)) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (Number(business.amount_raised) /
                                Number(business.funding_goal)) *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        ${Number(business.amount_raised).toLocaleString()} raised
                      </span>
                      <span className="font-medium">
                        ${Number(business.funding_goal).toLocaleString()} goal
                      </span>
                    </div>
                  </FloatingCard>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
