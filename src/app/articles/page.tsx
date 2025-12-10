import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import ArticlesHeroSection from "@/components/articles/ArticlesHeroSection";
import ArticlesSection from "@/components/home/ArticlesSection";

const ArticlesPage = () => {
  return (
    <main className="min-h-screen bg-[#FAF9F8]">
      <Navbar />
      <ArticlesHeroSection />
      <ArticlesSection />
      <Footer />
    </main>
  );
};

export default ArticlesPage;
