"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Eye, EyeOff, Loader } from "lucide-react";
import { set } from "sanity";

type SignInCardProps = {
    onClose?: () => void;
    handleSignup?: () => void;
    handleIsLoggedIn?: () => void
   handleForgetPassword?: () => void
};

const SignInCard: React.FC<SignInCardProps> =({onClose,handleSignup,handleIsLoggedIn,handleForgetPassword})=> {
  const [showPassword, setShowPassword] = useState(false);
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
    remeberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
        "remeberMe": signInData.remeberMe
      }
      console.log(body);
      
      const res = await fetch('/api/auth/login', {
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
          remeberMe: false,
        });
        handleIsLoggedIn && handleIsLoggedIn();
        onClose && onClose();
        setIsLoading(false);
      }
    } catch (error: any) {
      setError(error?.message);
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-[48px] border bg-[#FAF9F8] p-8 shadow-xl">
        
       <div className="flex flex-col gap-4">

        <div className="flex justify-between">
          {/* Header */}
        <div>
          <h2 className="text-[30px] font-bold text-[#1E293B]">
          Welcome Back
        </h2>
        <p className="mt-1 text-lg text-[#505050]">
          Access your membership benefits, community discussions, and episode insights.
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
            type="email"
            placeholder="Email Address"
            name="email"
            value={signInData.email}
            onChange={handleInputChange}
            className="w-full rounded-full border border-[#E2E8F0] bg-[#FAF9F8] px-4 py-3 text-[#505050] text-sm outline-none"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
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

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-[#64748B]">
            <input
             name="remeberMe"
              checked={signInData.remeberMe}
              onChange={(e) => setSignInData((prev) => ({
                ...prev,
                remeberMe: e.target.checked,
              }))}
             type="checkbox" className="rounded border-[#E2E8F0]" />
            Remember me
          </label>
            <p
             onClick={handleForgetPassword}
             className="font-inter font-weight-[400] text-sm text-[#D62828] cursor-pointer">Forgot password?</p>
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
              "LogIn"
            )
           }
          </button>
        </form>

        {/* Footer */}
        <p className="mt-4 text-center text-sm text-[#000000]">
          Don’t have an account?{" "}
          <span className="cursor-pointer text-[#D62828] font-medium">
            <button onClick={handleSignup}>Sign Up</button>
          </span>
        </p>
       </div>
      </div>
    </div>
  );
}

export default SignInCard