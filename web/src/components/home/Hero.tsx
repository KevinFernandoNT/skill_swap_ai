
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-white">
      <div className="container relative z-10 mx-auto px-6 md:px-8 lg:px-12">
        <div className="max-w-screen-xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
            Build in a weekend<br />
            <span className="text-green-600">Scale to millions</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            SkillSwap AI is the peer-to-peer learning platform.<br />
            Start your project with AI-powered matching, instant skill exchanges, real-time collaboration, 
            progress tracking, and personalized learning paths.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
              <Link to="/signup">
                Start your project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg">
              Request a demo
            </Button>
          </div>

          {/* Trusted by section */}
          <div className="mb-16">
            <p className="text-sm text-gray-500 mb-8">Trusted by fast-growing companies worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400">mozilla</div>
              <div className="text-2xl font-bold text-gray-400">github</div>
              <div className="text-2xl font-bold text-gray-400">1password</div>
              <div className="text-2xl font-bold text-gray-400">pwc</div>
              <div className="text-2xl font-bold text-gray-400">pika</div>
              <div className="text-2xl font-bold text-gray-400">humata</div>
              <div className="text-2xl font-bold text-gray-400">udio</div>
              <div className="text-2xl font-bold text-gray-400">langchain</div>
              <div className="text-2xl font-bold text-gray-400">resend</div>
              <div className="text-2xl font-bold text-gray-400">loops</div>
              <div className="text-2xl font-bold text-gray-400">mobbin</div>
              <div className="text-2xl font-bold text-gray-400">gopuff</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
