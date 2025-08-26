
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoginForm } from "@/components/forms/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 bg-background">
        <div className="w-full max-w-md px-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-foreground">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to continue to SkillSwap</p>
          </div>
          
          <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
            <LoginForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
