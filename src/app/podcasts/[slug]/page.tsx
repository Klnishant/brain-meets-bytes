import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import PlayListHeroPage from "@/components/episodes/PlayListHeroPage";

interface PodcastPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const PlayListPage = () => {
    return (
        <main className="min-h-screen bg-[#FAF9F8]">
            <Navbar />

            <PlayListHeroPage />
            <Footer />

        </main>
    );
};

export default PlayListPage;