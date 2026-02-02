import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import ArticlesHeroSection from "@/components/articles/ArticlesHeroSection";
import ArticlesListSection from "@/components/articles/ArticlesListSection";

const ArticlesPage = () => {
  return (
    <main className="min-h-screen bg-[#FAF9F8]">
      <Navbar />
      <ArticlesHeroSection />
      <div id="articles-list">
        <ArticlesListSection />
      </div>
      <Footer />
    </main>
  );
};

export default ArticlesPage;
