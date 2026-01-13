"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Eye, EyeOff, Loader, CircleUserRound } from "lucide-react";
import toast from "react-hot-toast";
import { set } from "sanity";

type ResetPasswordCardProps = {
  onClose?: () => void;
  handleSignIn?: () => void;
};

const ResetPasswordCard: React.FC<ResetPasswordCardProps> = ({
  onClose,
  handleSignIn,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    // Handle form submission logic here

    if (
      !signupData.email ||
      !signupData.password ||
      !signupData.confirmPassword
    ) {
      return;
    }

    // Perform signup logic here
    try {
      const body = {
        email: signupData.email,
        oldPassword: signupData.password,
        newPassword: signupData.confirmPassword
      };
      console.log(body);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setSignupData({
          email: "",
          password: "",
          confirmPassword: "",
        });
        const data = await res.json();
        console.log(data);

        onClose && onClose();
        handleSignIn && handleSignIn();

        setIsSubmitting(false);
        toast.success("password reset successfully!");
      }
    } catch (error: any) {
      console.error(error);
      setError(error?.message);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
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
                Reset Your Password
              </h2>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className=" rounded-full h-10 w-13 flex items-center justify-center bg-gray-100 p-2 hover:bg-gray-200"
            >
              <X className="h-5 w-5 text-[#023047]" />
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
              value={signupData.email}
              onChange={handleInputChange}
              className="w-full rounded-full border border-[#E2E8F0] bg-[#FAF9F8] px-4 py-3 text-[#505050] text-sm outline-none"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="OldPassword"
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
                placeholder="New Password"
                name="confirmPassword"
                value={signupData.confirmPassword}
                onChange={handleInputChange}
                className="w-full rounded-full border border-[#E2E8F0] bg-[#FAF9F8] px-4 py-3 text-[#505050] text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#505050]"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-full bg-[#D62828] py-3 text-white font-semibold hover:bg-red-700 transition"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center w-full">
                  <Loader size={14} className="animate-spin" />
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordCard;
