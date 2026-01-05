import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import ForumsPageContent from "@/components/forums/ForumsPageContent";
import MobileViewBar from "@/components/forums/MobileViewBar";

const ForumsPage = () => {
  return (
    <main className="min-h-screen bg-[#FAF9F8] relative">
      <Navbar />
      <ForumsPageContent />
      <div className="absolute lg:hidden bottom-20 z-10 mx-auto w-full flex justify-center" >
        <MobileViewBar />
      </div>
      <Footer />
    </main>
  );
};

export default ForumsPage;
