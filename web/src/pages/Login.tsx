
import { Link } from "react-router-dom";
import { LoginForm } from "@/components/forms/LoginForm";
import { PageTransition } from "@/components/common/PageTransition";

const Login = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex">
          {/* Left Section - Form (60% width) */}
          <div className="w-3/5 flex flex-col justify-center items-center px-16 py-12 bg-card">
            <div className="max-w-md w-full">
              <div className="mb-8 text-left">
                <h1 className="text-4xl font-bold mb-4 text-foreground">Welcome Back!</h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Sign in to continue to SkillSwap
                </p>
              </div>
              
              <LoginForm />
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
                <h2 className="text-4xl font-bold text-white mb-6">Make a Dream.</h2>
                <p className="text-white/80 text-lg leading-relaxed mb-8">
                  "Connect with skilled professionals and exchange knowledge. 
                  Build your network while sharing your expertise with others."
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Login;
