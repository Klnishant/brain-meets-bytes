import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import ForumsPageContent from "@/components/forums/ForumsPageContent";
import MobileViewBar from "@/components/forums/MobileViewBar";

const ForumsPage = () => {
  return (
    <main className="min-h-screen bg-[#FAF9F8] relative">
      <Navbar />
      <ForumsPageContent />
      <Footer />
    </main>
  );
};

export default ForumsPage;
