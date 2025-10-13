
import { 
  Database, 
  Shield, 
  Zap, 
  Cloud, 
  Radio, 
  Brain,
  BarChart3
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
      "bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-green-200",
      className
    )}
    style={style}
  >
    <div className="mb-4 inline-flex text-green-600">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export const Features = () => {
  const features = [
    {
      icon: <Database size={24} />,
      title: "AI Matching Engine",
      description: "Every project is powered by our advanced AI matching system, connecting learners with the perfect skill exchange partners. 100% intelligent matching.",
    },
    {
      icon: <Shield size={24} />,
      title: "Secure Learning",
      description: "Add verified profiles and secure learning sessions, protecting your progress with advanced security measures.",
    },
    {
      icon: <Zap size={24} />,
      title: "Instant Sessions",
      description: "Easily start learning sessions without complex setup or scheduling conflicts.",
    },
    {
      icon: <Cloud size={24} />,
      title: "Progress Storage",
      description: "Store, organize, and track your learning progress, from skills to achievements.",
    },
    {
      icon: <Radio size={24} />,
      title: "Real-time Learning",
      description: "Build collaborative experiences with real-time skill sharing and feedback.",
    },
    {
      icon: <Brain size={24} />,
      title: "AI Recommendations",
      description: "Integrate your favorite learning models to store, index and search personalized learning paths.",
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Learning APIs",
      description: "Instant ready-to-use RESTful APIs for seamless integration with your learning tools.",
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Use one or all. Best of breed products. Integrated as a platform.
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Use SkillSwap AI with any learning framework
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
