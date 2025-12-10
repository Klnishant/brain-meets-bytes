import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import AboutHeroSection from "@/components/about/AboutHeroSection";
import AboutMissionSection from "@/components/about/AboutMissionSection";
import AboutWhatWeExploreSection from "@/components/about/AboutWhatWeExploreSection";
import AboutApproachSection from "@/components/about/AboutApproachSection";
import AboutJoinCommunitySection from "@/components/about/AboutJoinCommunitySection";
import AboutNewsletterSection from "@/components/about/AboutNewsletterSection";

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-[#FAF9F8]">
      <Navbar />
      <AboutHeroSection />
      <AboutMissionSection />
      <AboutWhatWeExploreSection />
      <AboutApproachSection />
      <AboutJoinCommunitySection />
      <AboutNewsletterSection />

      <Footer />
    </main>
  );
};

export default AboutPage;
