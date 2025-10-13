import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CustomerStories = () => {
  const stories = [
    {
      title: "Maergo's Express Delivery: How SkillSwap AI Helped Achieve Scalability, Speed, and Cost Saving",
      company: "Maergo",
      logo: "Maergo"
    },
    {
      title: "Bootstrapped founder builds an AI learning app with SkillSwap AI and scales to $1M in 5 months.",
      company: "TechStart",
      logo: "TechStart"
    },
    {
      title: "Scaling securely: one million users in 7 months protected with SkillSwap AI Auth",
      company: "SecureLearn",
      logo: "SecureLearn"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Trusted by the world's most innovative companies.
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            See how SkillSwap AI empowers companies of all sizes to accelerate their growth and streamline their learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stories.map((story, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-sm font-semibold text-gray-500 mb-2">{story.logo}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{story.title}</h3>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            View all stories
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
