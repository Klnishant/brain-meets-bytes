"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Eye, EyeOff, Loader } from "lucide-react";
import toast from "react-hot-toast";

type SignupCardProps = {
  onClose?: () => void;
  handleSignIn?: () => void;
  handleIsLoggedIn?: () => void;
};

const SignupCard: React.FC<SignupCardProps> = ({onClose,handleSignIn,handleIsLoggedIn})=> {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting,setIsSubmitting] = useState(false);
  const [signupData, setSignupData] = useState({
    "name": "",
   "email": "",
    "password": "",
    "confirmPassword": "",
    "ProfilePic": "myself",
    "hasmembership": false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Handle form submission logic here

    if(!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      return;
    }

    // Perform signup logic here
    try {
      if(signupData.password !== signupData.confirmPassword) {
        throw new Error("Password and confirm password do not match");
      }
      const body = {
        "name": signupData.name,
        "email": signupData.email,
        "password": signupData.password,
        "hasmembership": signupData.hasmembership,
        "ProfilePic": signupData.ProfilePic
      }
      console.log(body);
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if(res.ok) {
        setSignupData({
          "name": "",
          "email": "",
          "password": "",
          "confirmPassword": "",
          "ProfilePic": "myself",
          "hasmembership": false
        });
        const data = await res.json();
        console.log(data);

        handleSignIn && handleSignIn();

        setIsSubmitting(false);

        handleIsLoggedIn && handleIsLoggedIn();
        toast.success("Account created successfully!");
        
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create account. Please try again.");
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
          Create Your Account
        </h2>
        <p className="mt-1 text-lg text-[#505050]">
          Join the community exploring smarter brain health and longevity.
        </p>
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
            type="text"
            placeholder="Full Name"
            name="name"
            value={signupData.name}
            onChange={handleInputChange}
            className="w-full rounded-full border border-[#E2E8F0] bg-[#FAF9F8] px-4 py-3 text-[#505050] text-sm outline-none"
          />

          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={signupData.email}
            onChange={handleInputChange}
            className="w-full rounded-full border border-[#E2E8F0] bg-[#FAF9F8] px-4 py-3 text-[#505050] text-sm outline-none"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={signupData.password}
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

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              name="confirmPassword"
              value={signupData.confirmPassword}
              onChange={handleInputChange}
              className="w-full rounded-full border border-[#E2E8F0] bg-[#FAF9F8] px-4 py-3 text-[#505050] text-sm outline-none"
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#505050]"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-full bg-[#D62828] py-3 text-white font-semibold hover:bg-red-700 transition"
          >
            {
            isSubmitting ? (
              <div className="flex items-center justify-center w-full">
                <Loader size={14} className="animate-spin" />
              </div>
            ):
            (
              "LogIn"
            )
           }
          </button>
        </form>

        {/* Footer */}
        <p className="mt-4 text-center text-sm text-[#000000]">
          Already have an account?{" "}
          <span className="cursor-pointer text-[#D62828] font-medium">
            <button onClick={handleSignIn}>Login</button>
          </span>
        </p>
       </div>
      </div>
    </div>
  );
}

export default SignupCard