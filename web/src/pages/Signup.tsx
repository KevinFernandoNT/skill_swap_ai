
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SignupForm } from "@/components/forms/SignupForm";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 bg-background">
        <SignupForm />
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
