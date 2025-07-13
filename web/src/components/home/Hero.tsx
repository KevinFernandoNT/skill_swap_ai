
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MindMap } from "./MindMap";

export const Hero = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup with email:", email);
    // Implement your signup logic here
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden hero-gradient">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-foreground"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-accent/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl"></div>
      
      <div className="container relative z-10 mx-auto px-6 md:px-8 lg:px-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Level Up Your Skills with Peer-to-Peer Learning
              </h1>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0">
                Connect with peers, learn from experts, and accelerate your growth using our advanced AI-driven personalized learning paths.
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button type="submit" className="whitespace-nowrap btn-supabase">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
              </div>
      
            </div>
            
            <div className="flex-1 relative">
              {/* Replace chat component with the mind map */}
              <MindMap />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
