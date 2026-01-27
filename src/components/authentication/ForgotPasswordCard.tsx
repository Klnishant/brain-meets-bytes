"use client";

import { Loader, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { set } from "sanity";

type ForgotPasswordCardProps = {
    onClose?: () => void;
    handleResetPassword?: () => void
};

const ForgotPasswordCard: React.FC<ForgotPasswordCardProps> = ({onClose,handleResetPassword}) => {
  const [email, setEmail] = useState({
    email: "",
  });
  const [submiting, setSubmiting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setEmail((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmiting(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}users/forgotPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(email),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to forgot password");
      }
      const data = await res.json();
      console.log(data);
      toast.success(`${data.message}`);
      onClose && onClose();
      handleResetPassword && handleResetPassword();
    } catch (error: any) {
      setError(error?.message);
      console.log(error?.message, "failed to reset password");
    } finally {
      setSubmiting(false);
    }
  };
  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="relative w-full max-w-md rounded-[48px] border bg-[#FAF9F8] p-8 shadow-xl">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              {/* Header */}
              <div>
                <h2 className="text-[30px] font-bold text-[#1E293B]">
                  Forgot Password
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
                required={true}
                value={email.email}
                onChange={handleInputChange}
                className="w-full rounded-full border border-[#E2E8F0] bg-[#FAF9F8] px-4 py-3 text-[#505050] text-sm outline-none"
              />
              {error && <p className="text-red-500">{error}</p>}
              {/* Submit Button */}
              <button
                type="submit"
                disabled={submiting}
                className="mt-2 w-full rounded-full bg-[#D62828] py-3 text-white font-semibold hover:bg-red-700 transition"
              >
                {submiting ? (
                  <div className="flex items-center justify-center w-full">
                    <Loader size={14} className="animate-spin" />
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordCard;