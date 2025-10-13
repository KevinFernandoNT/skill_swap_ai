
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { CustomerStories } from "@/components/home/CustomerStories";
import { Community } from "@/components/home/Community";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <CustomerStories />
        <Community />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
