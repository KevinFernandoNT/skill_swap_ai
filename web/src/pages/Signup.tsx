
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SignupForm } from "@/components/forms/SignupForm";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 bg-gradient-to-br from-foreground to-gray-900 text-white">
        <div className="w-[600px]  px-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl text-white font-bold mb-2">Create your account</h1>
            <p className="text-gray-400">Join SkillSwap and start learning today</p>
          </div>
          
          <div className="bg-white  p-8 rounded-2xl shadow-sm border border-gray-100">
            <SignupForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
