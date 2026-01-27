"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, Eye, EyeOff, Loader, CircleUserRound } from "lucide-react";
import toast from "react-hot-toast";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  RoleId: number;
  Rolename: string;
  hasmembership: boolean;
  userId: number;
  ProfilePic: string;
};

type UpdateProfileProps = {
    name: string | null;
    email: string | null;
    ProfilePic: string | null;
    onClose: () => void;
    userId: number
    handleUpdate: (data: User) => void
};

const UpdateProfile: React.FC<UpdateProfileProps> = ({
  name,
  email,
  ProfilePic,
  onClose,
  userId,
  handleUpdate
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    setSignupData({
      name: name || "",
      email: email || "",
    });
  },[name, email]);

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

  if (
    !signupData.name ||
    !signupData.email
  ) {
    setError("Please fill in all the required fields.");
    setIsSubmitting(false);
    return;
  }

  try {

    const formData = new FormData();
    formData.append("name", signupData.name);
    formData.append("email", signupData.email);

    if (image) {
      formData.append("ProfilePic", image);
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}users?userId=${userId}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update account");
    }

    const data = await res.json();
    handleUpdate(data?.data);
    onClose();

    toast.success("Account updated successfully!");
  } catch (error: any) {
    console.error(error);
    setError(error.message || "Something went wrong");
    toast.error("Failed to update account");
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
                Update Your Profile
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
            <div className="flex w-full items-center gap-4">
              <label
                htmlFor="image-upload"
                className="cursor-pointer w-full rounded-lg text-[#64748B] text-sm hover:bg-gray-50"
              >
                <div className="inline-flex w-full justify-center items-center">
                  {image ? (
                    <div>
                      <img src={URL.createObjectURL(image)} alt=""
                       className="w-30 h-30 object-cover rounded-full"
                       />
                    </div>
                  ):(
                    <div>
                      {
                        ProfilePic ? (
                          <img src={ProfilePic} alt=""
                           className="w-30 h-30 object-cover rounded-full"
                           />
                        ):(
                          <CircleUserRound className="w-30 h-30 object-cover rounded-full" />
                        )
                      }
                    </div>
                  )}
                </div>
                <div>
                </div>
                <input
                  id="image-upload"
                  name="image-upload"
                  type="file"
                  required={true}
                  onChange={handleImageChange}
                  multiple
                  hidden
                  accept="image/*"
                />
              </label>
            </div>
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              required={true}
              value={signupData.name}
              onChange={handleInputChange}
              className="w-full rounded-full border border-[#E2E8F0] bg-[#FAF9F8] px-4 py-3 text-[#505050] text-sm outline-none"
            />

            <input
              type="email"
              placeholder="Email Address"
              name="email"
              required={true}
              value={signupData.email}
              onChange={handleInputChange}
              className="w-full rounded-full border border-[#E2E8F0] bg-[#FAF9F8] px-4 py-3 text-[#505050] text-sm outline-none"
            />

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
                "Update Profile"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
