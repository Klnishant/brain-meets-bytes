import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import PodcastsHeroSection from "@/components/podcasts/PodcastsHeroSection";
import PodcastsMainSection from "@/components/podcasts/PodcastsMainSection";

const PodcastsPage = () => {
    return (
        <main className="min-h-screen bg-[#FAF9F8]">
            <Navbar />

            <PodcastsHeroSection />
            <PodcastsMainSection />
            <Footer />

        </main>
    );
};

export default PodcastsPage;