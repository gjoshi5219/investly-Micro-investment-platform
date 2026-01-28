import { motion } from "framer-motion";
import { Twitter, Linkedin, Instagram, Github } from "lucide-react";

const footerLinks = {
  Product: ["How It Works", "For Investors", "For Businesses", "Pricing", "FAQ"],
  Company: ["About Us", "Careers", "Press", "Blog", "Contact"],
  Legal: ["Terms of Service", "Privacy Policy", "Cookie Policy", "Disclosures"],
  Resources: ["Help Center", "API Docs", "Community", "Status", "Security"],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Github, href: "#", label: "GitHub" },
];

export function Footer() {
  return (
    <footer className="relative pt-20 pb-10 border-t border-border/50">
      <div className="container px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-xl font-bold text-white font-display">I</span>
              </div>
              <span className="text-xl font-bold font-display">Investly</span>
            </a>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Empowering everyday investors to back local businesses and build wealth together.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Investly Inc. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground max-w-2xl text-center md:text-right">
            Investments involve risk, including possible loss of principal. Past performance is not 
            indicative of future results. This is not investment advice.
          </p>
        </div>
      </div>
    </footer>
  );
}