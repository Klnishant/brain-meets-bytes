"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Eye, EyeOff, Loader } from "lucide-react";
import { set } from "sanity";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/Redux/store";
import { fetchAuth } from "@/Redux/slices/AuthSlice";
import toast from "react-hot-toast";

type SignInCardProps = {
    onClose?: () => void;
  handleSignIn?: () => void;
  handleIsLoggedIn?: () => void;
};

const VerifyEmail: React.FC<SignInCardProps> =({onClose,handleIsLoggedIn,handleSignIn})=> {
  const [showPassword, setShowPassword] = useState(false);
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSending,setIsSending] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    // Handle form submission logic here
    if (!signInData.email || !signInData.password) {
      setError("Please fill in all the required fields.");
      return;
    }
    try {
      const body = {
        "email": signInData.email,
        "password": signInData.password,
      }
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/verify-email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      console.log(res);
      
      if (res.ok) {
        const data = await res.json();
        console.log(data);

        setSignInData({
          email: "",
          password: "",
        });
        handleSignIn && handleSignIn();
        handleIsLoggedIn && handleIsLoggedIn();
        onClose && onClose();
        setIsLoading(false);
      }
    } catch (error: any) {
      setError(error?.message);
      console.error("verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async(e: React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault()
        setIsSending(true);
    setError(null);
    // Handle form submission logic here
    if (!signInData.email) {
      setError("Please fill in all the required fields.");
      return;
    }
    try {
      const body = {
        "email": signInData.email,
      }
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/resend-otp'}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      console.log(res);
      
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        toast.success("OTP sent successfully!");

        setSignInData({
          email: "",
          password: "",
        });
        setIsSending(false);
      }
    } catch (error: any) {
      setError(error?.message);
      console.error("Error in sending OTP:", error);
      toast.error("Failed to Send OTP");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-[48px] border bg-[#FAF9F8] p-8 shadow-xl">
        
       <div className="flex flex-col gap-4">

        <div className="flex justify-between">
          {/* Header */}
        <div>
          <h2 className="text-[30px] font-bold text-[#1E293B]">
          Verify Your Email
        </h2>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className=" rounded-full h-10 w-13 flex items-center justify-center bg-gray-100 p-2 hover:bg-gray-200"
        >
          <X className="h-5 w-5 text-[#023047]"  />
        </button>
        </div>

        {/* Form */}
        <form 
        className="mt-6 space-y-4"
        method="post"
        noValidate
        onSubmit={handleSubmit}
        >
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            required={true}
            value={signInData.email}
            onChange={handleInputChange}
            className="w-full rounded-full border border-[#E2E8F0] bg-[#FAF9F8] px-4 py-3 text-[#505050] text-sm outline-none"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter OTP"
              name="password"
              required={true}
              value={signInData.password}
              onChange={handleInputChange}
              className="w-full rounded-full border border-[#E2E8F0] bg-[#FAF9F8] px-4 py-3 text-[#505050] text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#505050]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-full bg-[#D62828] py-3 text-white font-semibold hover:bg-red-700 transition"
          >
           {
            isLoading ? (
              <div className="flex items-center justify-center w-full">
                <Loader size={14} className="animate-spin" />
              </div>
            ):
            (
              "Verify OTP"
            )
           }
          </button>
        </form>
        {/* Footer */}
        <p className="mt-4 text-center text-sm text-[#000000]">
          Don’t received OTP?{" "}
          <span className="cursor-pointer text-[#D62828] font-medium">
            <button onClick={handleResendOTP}>Resend</button>
          </span>
        </p>
       </div>
      </div>
    </div>
  );
}

export default VerifyEmail