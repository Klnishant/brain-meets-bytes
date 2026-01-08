import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import Hero from "@/components/home/Hero";
import FeaturedPodcastsSection from "@/components/home/FeaturedPodcastsSection";
import ArticlesSection from "@/components/home/ArticlesSection";
import AboutKiSection from "@/components/home/AboutKiSection";
import AboutRebeccaSection from "@/components/home/AboutRebeccaSection";
import ForumsSection from "@/components/home/ForumsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF9F8]">
      <Navbar />
      <Hero />
      <FeaturedPodcastsSection />
      <ArticlesSection />
      <AboutKiSection />
      <AboutRebeccaSection />
      <ForumsSection />
      <NewsletterSection />
      <Footer />
      <div>
      </div>
    </main>
  );
}
