import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Businesses", href: "/businesses" },
  { label: "Why Investly", href: "#why-investly" },
  { label: "Security", href: "#security" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith("#")) {
      // If we're on the homepage, scroll to the section
      if (location.pathname === "/") {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // If we're on another page, navigate to homepage with hash
        navigate("/" + href);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "py-3 bg-background/80 backdrop-blur-xl border-b border-border/50"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="container px-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-xl font-bold text-white font-display">I</span>
              </div>
              <span className="text-xl font-bold font-display">Investly</span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              {loading ? null : user ? (
                <MagneticButton
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </MagneticButton>
              ) : (
                <>
                  <MagneticButton
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/auth")}
                  >
                    Log In
                  </MagneticButton>
                  <MagneticButton
                    variant="primary"
                    size="sm"
                    onClick={() => navigate("/auth")}
                  >
                    Get Started
                  </MagneticButton>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-muted transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[72px] z-40 md:hidden"
          >
            <div className="bg-background/95 backdrop-blur-xl border-b border-border p-6">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="text-lg font-medium text-foreground py-2 text-left"
                  >
                    {link.label}
                  </button>
                ))}
                <hr className="border-border my-2" />
                <div className="flex flex-col gap-3">
                  {loading ? null : user ? (
                    <MagneticButton
                      variant="primary"
                      size="md"
                      className="w-full justify-center"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate("/dashboard");
                      }}
                    >
                      Dashboard
                    </MagneticButton>
                  ) : (
                    <>
                      <MagneticButton
                        variant="ghost"
                        size="md"
                        className="w-full justify-center"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate("/auth");
                        }}
                      >
                        Log In
                      </MagneticButton>
                      <MagneticButton
                        variant="primary"
                        size="md"
                        className="w-full justify-center"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate("/auth");
                        }}
                      >
                        Get Started
                      </MagneticButton>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
