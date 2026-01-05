'use client'

import Footer from "@/components/core/Footer";
import Navbar from "@/components/core/Navbar";
import CreateCategory from "@/components/forums/CreateCategory"

const CreateCategoryPage = ()=> {
    return (
        <main className="min-h-screen bg-[#FAF9F8] ">
            <Navbar />
            <div className="max-w-1/2 mx-auto p-10">
                <CreateCategory />
            </div>
            <Footer />
        </main>
    )
}

export default CreateCategoryPage;