'use client';

import Footer from '@/components/core/Footer';
import Navbar from '@/components/core/Navbar';
import { useRouter } from 'next/navigation';

export default function PaymentFailed() {
  const router = useRouter();

  return (
    <main className='min-h-screen bg-[#FAF9F8]'>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-red-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </div>
          </div>

          {/* Content */}
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Payment Failed
          </h1>
          <p className="text-gray-600 mb-8">
            We couldn't process your payment. Please check your payment details and try again.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.back()}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-md"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </main>
  );
}