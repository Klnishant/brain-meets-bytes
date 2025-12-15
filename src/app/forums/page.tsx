import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import ForumsPageContent from "@/components/forums/ForumsPageContent";

const ForumsPage = () => {
  return (
    <main className="min-h-screen bg-[#FAF9F8]">
      <Navbar />
      <ForumsPageContent />
      <Footer />
    </main>
  );
};

export default ForumsPage;
