
import { Logo } from "@/components/common/Logo";

const FooterSection = ({ title, links }: { title: string, links: { label: string, href: string }[] }) => (
  <div className="flex flex-col gap-4">
    <h5 className="font-semibold text-gray-900">{title}</h5>
    <ul className="flex flex-col gap-2">
      {links.map((link) => (
        <li key={link.label}>
          <a href={link.href} className="text-gray-600 hover:text-gray-900 transition-colors">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white py-12 md:py-16 border-t border-gray-200">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Logo className="mb-4" />
            <p className="text-gray-600 mb-6 max-w-xs text-sm">
              We protect your data.
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <div>SOC2 Type 2 Certified</div>
              <div>HIPAA Compliant</div>
            </div>
          </div>
          
          <FooterSection 
            title="Product" 
            links={[
              { label: "Database", href: "#database" },
              { label: "Auth", href: "#auth" },
              { label: "Functions", href: "#functions" },
              { label: "Realtime", href: "#realtime" },
              { label: "Storage", href: "#storage" },
              { label: "Vector", href: "#vector" },
              { label: "Cron", href: "#cron" },
              { label: "Pricing", href: "#pricing" },
            ]}
          />
          
          <FooterSection 
            title="Solutions" 
            links={[
              { label: "AI Builders", href: "#ai-builders" },
              { label: "No Code", href: "#no-code" },
              { label: "Beginners", href: "#beginners" },
              { label: "Developers", href: "#developers" },
              { label: "Startups", href: "#startups" },
              { label: "Enterprise", href: "#enterprise" },
            ]}
          />
          
          <FooterSection 
            title="Resources" 
            links={[
              { label: "Blog", href: "/blog" },
              { label: "Support", href: "/support" },
              { label: "System Status", href: "/status" },
              { label: "Become a Partner", href: "/partner" },
              { label: "Integrations", href: "/integrations" },
              { label: "Brand Assets", href: "/brand" },
              { label: "Security & Compliance", href: "/security" },
            ]}
          />
          
          <FooterSection 
            title="Developers" 
            links={[
              { label: "Documentation", href: "/docs" },
              { label: "Supabase UI", href: "/ui" },
              { label: "Changelog", href: "/changelog" },
              { label: "Careers", href: "/careers" },
              { label: "Contributing", href: "/contributing" },
              { label: "Open Source", href: "/opensource" },
            ]}
          />
          
          <FooterSection 
            title="Company" 
            links={[
              { label: "Company", href: "/company" },
              { label: "General Availability", href: "/ga" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Privacy Settings", href: "/privacy-settings" },
              { label: "Acceptable Use Policy", href: "/aup" },
              { label: "Support Policy", href: "/support-policy" },
              { label: "Service Level Agreement", href: "/sla" },
            ]}
          />
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Logo className="h-6" />
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="sr-only">Discord</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="sr-only">YouTube</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            © {currentYear} SkillSwap AI Inc
          </p>
        </div>
      </div>
    </footer>
  );
};
