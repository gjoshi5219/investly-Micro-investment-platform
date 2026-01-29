import { useEffect, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sanitizeError, devError } from "@/lib/error-utils";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setProfile(data);
        setFormData({
          fullName: data.full_name || "",
          bio: data.bio || "",
        });
      }
    } catch (error) {
      devError("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          bio: formData.bio,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
      fetchProfile();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: sanitizeError(error, "Failed to update profile. Please try again."),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

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
        <div className="container px-4 max-w-2xl">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">
              Your Profile
            </h1>
            <p className="text-muted-foreground mb-8">
              Manage your account information and preferences.
            </p>

            <FloatingCard className="p-6 md:p-8">
              {/* Avatar Section */}
              <div className="flex items-center gap-4 mb-8">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                    {profile?.full_name?.[0]?.toUpperCase() || (
                      <User className="w-8 h-8" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold font-display">
                    {profile?.full_name || "Your Name"}
                  </h2>
                  <p className="text-muted-foreground">{profile?.email}</p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="bg-card-elevated border-border"
                  />
                </div>

                {/* Email (read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profile?.email || ""}
                    disabled
                    className="bg-muted border-border opacity-60"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed here.
                  </p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us a bit about yourself..."
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="bg-card-elevated border-border min-h-[120px]"
                  />
                </div>

                <MagneticButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
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
