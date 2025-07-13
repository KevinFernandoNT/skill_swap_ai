
import { 
  Brain, 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  Users, 
  FileText,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import React, { CSSProperties } from "react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  style?: CSSProperties;
}

const FeatureCard = ({ icon, title, description, className, style }: FeatureProps) => (
  <div 
    className={cn(
      "bg-gray-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-800 hover:border-primary/50",
      className
    )}
    style={style}
  >
    <div className="feature-icon mb-4 inline-flex">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export const Features = () => {
  const features = [
    {
      icon: <Brain size={24} />,
      title: "AI-Powered Learning",
      description: "Personalized learning paths and recommendations based on your goals and progress.",
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Progress Tracking",
      description: "Visualize your skill development with detailed analytics and insights.",
    },
    {
      icon: <Calendar size={24} />,
      title: "Smart Scheduling",
      description: "Optimize your study time with AI-recommended scheduling based on your availability.",
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Real-time Collaboration",
      description: "Connect with peers for study sessions, discussions, and knowledge sharing.",
    },
    {
      icon: <Users size={24} />,
      title: "Expert Community",
      description: "Access a network of mentors and field experts for guidance and feedback.",
    },
    {
      icon: <FileText size={24} />,
      title: "Resource Library",
      description: "Curated learning materials and resources tailored to your specific needs.",
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-foreground">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4 bg-primary/10 px-4 py-1.5 rounded-full text-primary font-medium text-sm">
            <Sparkles size={16} />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Everything you need to accelerate your learning</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Our AI-powered platform combines cutting-edge technology with best practices in education to create
            the most effective learning experience possible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
