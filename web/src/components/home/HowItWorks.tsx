
import { ArrowRight } from "lucide-react";
import { ChatBox } from "./ChatBox";

const steps = [
  {
    number: "01",
    title: "Profile Creation",
    description: "Create your learning profile and define your goals, current skills, and aspirations.",
    image: "/placeholder.svg",
  },
  {
    number: "02",
    title: "AI Assessment",
    description: "Our AI analyzes your profile to understand what you want to learn and what you are good at.",
    image: "/placeholder.svg",
  },
  {
    number: "03",
    title: "Community Connection",
    description: "Connect with peers and mentors who share your interests and can support your learnings.",
    image: "/placeholder.svg",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-foreground">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4 bg-secondary/10 px-4 py-1.5 rounded-full text-secondary font-medium text-sm">
            <span>Simple Process</span>
          </div>
          <h2 className="text-3xl text-white  md:text-4xl font-bold mb-4">How SkillSwap Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Our streamlined process makes it easy to start learning and improving your skills with the help of AI and a supportive community.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-inter font-bold text-primary">
                    {step.number}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl text-white font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
            
            <div className="flex items-center gap-2 text-primary font-medium cursor-pointer group">
              <span>Learn more about our methodology</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <ChatBox/>
        </div>
      </div>
    </section>
  );
};
