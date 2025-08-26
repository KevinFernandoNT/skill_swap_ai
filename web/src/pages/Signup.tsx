
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SignupForm } from "@/components/forms/SignupForm";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 bg-background">
        <div className="w-[600px] px-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-foreground">Create your account</h1>
            <p className="text-muted-foreground">Join SkillSwap and start learning today</p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
            <SignupForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
