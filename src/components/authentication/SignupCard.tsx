"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, Eye, EyeOff, Loader, CircleUserRound } from "lucide-react";
import toast from "react-hot-toast";
import { PortableText, PortableTextReactComponents } from "next-sanity";
import { TypedObject } from "sanity";

type SignupCardProps = {
  onClose?: () => void;
  handleSignIn?: () => void;
  handleIsLoggedIn?: () => void;
};

type FooterContent = {
  tremsAndConditions: TypedObject[];
};

const components: Partial<PortableTextReactComponents> = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-4 mb-1 text-lg font-semibold">{children}</h2>
    ),
    normal: ({ children }) => (
      <p className="mb-1 leading-relaxed ">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-5 space-y-1">{children}</ul>
    ),
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
  },
};

const TermsAndConditions = () => {
  const [content, setContent] = useState<FooterContent | null>(null);
  
    useEffect(() => {
      let mounted = true;
  
      const load = async () => {
        try {
          const res = await fetch("/api/footer");
          if (!res.ok) {
            throw new Error("Failed to load articles");
          }
  
          const data = (await res.json()) as FooterContent | null;
          if (!mounted) return;
          setContent(data);
        } catch (e: any) {
          if (!mounted) return;
        }
      };
  
      void load();
  
      return () => {
        mounted = false;
      };
    }, []);
  return (
    <section className="h-20 bg-[#FAF9F8] overflow-y-scroll scrollbar-hide">
            <div className="mx-auto flex max-w-[1600px] flex-col gap-8">
              <div className="text-[#505050] prose mx-auto ">
                {(content?.tremsAndConditions && (
                  <PortableText
                    value={content?.tremsAndConditions}
                    components={components}
                  />
                )) ?? (
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates repudiandae magnam soluta. Ipsum ad perferendis libero officiis debitis aut beatae cupiditate quae? Magnam atque cupiditate error illum, ipsum maiores accusamus distinctio quibusdam. Alias repudiandae omnis nisi corporis facere dolore voluptate iusto aut et ea modi est similique nesciunt officia perspiciatis at, sed optio recusandae in ex quibusdam mollitia eos possimus nam. Ducimus consequuntur ipsum, illum accusantium, non laboriosam harum debitis a atque animi voluptas. Velit porro molestiae expedita odit. Blanditiis velit in sit voluptate id fugit odio nemo laboriosam porro tempora minima ex amet rem veritatis modi adipisci, ad iste quo ea quia incidunt accusantium! Consequuntur quisquam veritatis est eveniet rem perspiciatis suscipit obcaecati, adipisci, aspernatur culpa deleniti asperiores provident corrupti, possimus cumque nobis beatae quos nemo? Officia suscipit nobis illum vero, in cupiditate nostrum placeat ut saepe assumenda numquam? Officia beatae sed laudantium, saepe iure velit blanditiis autem aut dolore? Doloremque, libero commodi sapiente temporibus maxime ullam itaque iusto ab et modi vitae praesentium facilis magni quia quam veniam, necessitatibus aliquid saepe architecto aspernatur. Ad numquam est cum non minus ducimus, deserunt repellendus inventore eius vero neque eligendi perspiciatis quo fugit, exercitationem maiores iste molestiae at officiis facere doloremque.</p>
                )}
              </div>
            </div>
          </section>
  );
};

const SignupCard: React.FC<SignupCardProps> = ({
  onClose,
  handleSignIn,
  handleIsLoggedIn,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsAndConditions, setShowTermsAndConditions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    hasmembership: false,
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

  if (
    !signupData.name ||
    !signupData.email ||
    !signupData.password ||
    !signupData.confirmPassword
  ) {
    setError("Please fill in all the required fields.");
    setIsSubmitting(false);
    return;
  }

  if (!acceptedTerms) {
    setError("Please accept the terms and conditions.");
    setIsSubmitting(false);
    return;
  }

  try {
    if (signupData.password !== signupData.confirmPassword) {
      throw new Error("Password and confirm password do not match");
    }

    const formData = new FormData();
    formData.append("name", signupData.name);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    formData.append(
      "hasmembership",
      String(signupData.hasmembership)
    );

    if (image) {
      formData.append("ProfilePic", image);
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}users`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error("Signup failed");
    }

    await res.json();

    setSignupData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      hasmembership: false,
    });
    setImage(null);

    toast.success("Account created successfully!");
    handleSignIn?.();
    handleIsLoggedIn?.();
  } catch (error: any) {
    console.error(error);
    setError(error.message || "Something went wrong");
    toast.error("Failed to create account");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-[48px] border bg-[#FAF9F8] px-8 py-4 shadow-xl">
        <div className="flex flex-col gap-2">
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
              <X className="h-5 w-5 text-[#023047]" />
            </button>
          </div>

          {/* Form */}
          <form
            className="mt-4 space-y-4"
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
                      <CircleUserRound size={100} />
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

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                required={true}
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
                required={true}
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

            {/* Terms and Conditions */}
            <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-[#64748B]">
            <input
             name="acceptedTerms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
             type="checkbox" className="rounded border-[#E2E8F0]" />
             <p onClick={()=>setShowTermsAndConditions(!showTermsAndConditions)}>I agree to the terms and conditions</p>
          </label>
          </div>

          <div className={`${showTermsAndConditions ? "block" : "hidden"} z-60 absolute top-2/3`}>
            <div className="w-full flex justify-end">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-[#505050]"
              onClick={() => setShowTermsAndConditions(false)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
            <TermsAndConditions />
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
                "SignUp"
              )}
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
};

export default SignupCard;
