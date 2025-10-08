
import { Link } from "react-router-dom";
import { MultiStepSignupForm } from "@/components/forms/MultiStepSignupForm";
import { PageTransition } from "@/components/common/PageTransition";
import { LogoWhite } from "@/components/common/LogoWhite";

const Signup = () => {
  return (
    <PageTransition>
      <div className="bg-black min-h-screen flex flex-col">
        <main className="flex-grow flex">
          {/* Left Section - Form (60% width) */}
          <div className="w-3/5 flex flex-col justify-center items-center px-16 py-12 bg-black">
            <div className="max-w-md w-full">
              <div className="mb-8 text-left">
                <div className="mb-6">
                  <LogoWhite className="mb-4" />
                </div>
                <h1 className="text-4xl font-bold mb-4 text-white">Join SkillSwap</h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Create your account and start exchanging skills with professionals
                </p>
              </div>
              
              <MultiStepSignupForm />
            </div>
          </div>

          {/* Right Section - Inspirational Background (40% width) */}
          <div className="w-2/5 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10">
              {/* Abstract geometric shapes with theme colors */}
              <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full opacity-60 blur-sm"></div>
              <div className="absolute top-40 right-16 w-32 h-32 bg-white/5 rounded-full opacity-50 blur-sm"></div>
              <div className="absolute bottom-32 left-20 w-16 h-16 bg-white/15 rounded-full opacity-70 blur-sm"></div>
              <div className="absolute top-60 left-1/2 w-24 h-24 bg-white/8 rounded-full opacity-40 blur-sm"></div>
              <div className="absolute bottom-20 right-20 w-28 h-28 bg-white/12 rounded-full opacity-60 blur-sm"></div>
              
              {/* Flowing ribbon-like shapes with theme colors */}
              <div className="absolute top-32 left-1/3 w-40 h-2 bg-white/20 rounded-full opacity-50 transform rotate-12"></div>
              <div className="absolute bottom-40 right-1/3 w-32 h-2 bg-white/15 rounded-full opacity-60 transform -rotate-12"></div>
              <div className="absolute top-1/2 left-1/4 w-36 h-2 bg-white/10 rounded-full opacity-40 transform rotate-45"></div>
            </div>
            
            {/* Content overlay */}
            <div className="relative z-10 flex flex-col justify-center h-full px-12">
              <div className="mb-8">
                <div className="text-6xl text-white/20 mb-4">"</div>
                <h2 className="text-4xl font-bold text-white mb-6">Start Your Journey.</h2>
                <p className="text-white/80 text-lg leading-relaxed mb-8">
                  "Join a community of skilled professionals. Share your expertise, 
                  learn new skills, and build meaningful connections."
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Signup;
