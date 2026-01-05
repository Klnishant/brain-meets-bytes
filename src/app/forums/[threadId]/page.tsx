import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import ThreadDetails from "@/components/forums/ThreadDetails";
import MobileViewBar from "@/components/forums/MobileViewBar";

const ThreadDetailsPage = () => {
    return (
        <main className="min-h-screen bg-[#FAF9F8] relative">
            <Navbar />
            <ThreadDetails />
            <div className="absolute lg:hidden bottom-20 z-10 mx-auto w-full flex justify-center" >
        <MobileViewBar />
      </div>
            <Footer />

        </main>
    );
};

export default ThreadDetailsPage;