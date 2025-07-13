
import { Button } from "@/components/ui/button";

export const CallToAction = () => {
  return (
    <section className="py-16 md:py-24 bg-foreground text-white">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Ready to Accelerate Your Learning Journey?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Join thousands of learners with SkillSwap AI to reach their goals faster and more effectively.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-supabase">
              Get Started for Free
            </Button>
          
          </div>
        </div>
      </div>
    </section>
  );
};
