import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import ThreadDetails from "@/components/forums/ThreadDetails";

const ThreadDetailsPage = () => {
    return (
        <main className="min-h-screen bg-[#FAF9F8]">
            <Navbar />

            <ThreadDetails />
            <Footer />

        </main>
    );
};

export default ThreadDetailsPage;