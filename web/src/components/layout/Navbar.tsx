
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/Logo";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
  { label: "Dashboard", href: "/dashboard" },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="py-4 px-6 md:px-8 lg:px-12 relative z-50 bg-white border-b border-gray-100">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="z-10">
          <Logo />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-6">
        
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation Toggle */}
        <button 
          className="md:hidden z-10 text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-white pt-20 px-6 md:hidden animate-fade-in">
            <div className="flex flex-col space-y-6">
              {navItems.map((item) => (
                item.href.startsWith("/") ? (
                  <Link 
                    key={item.href} 
                    to={item.href}
                    className="text-gray-700 hover:text-primary text-lg font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a 
                    key={item.href} 
                    href={item.href}
                    className="text-gray-700 hover:text-primary text-lg font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              ))}
              <div className="flex flex-col space-y-3 pt-4">
                <Button variant="outline" asChild className="w-full bg-gray-800">
                  <Link className="font-bold" to="/login" onClick={() => setIsMenuOpen(false)}>Log in</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
