import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import Contact from "@/components/contact/Contact";

const ContactsPage = () => {
  return (
    <main className="min-h-screen bg-[#FAF9F8]">
      <Navbar />
      <Contact />
      <Footer />
    </main>
  );
};

export default ContactsPage;
