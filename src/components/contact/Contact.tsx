"use client";
import { COLORS } from "@/lib/constants";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";

function Contact() {
  const [contactData, setContactData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactData({ ...contactData, [name]: value });
  }

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here

    if(!contactData.firstName || !contactData.lastName || !contactData.email || !contactData.message) {
      return;
    }

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });
    if(res.ok) {
      setContactData({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      });
      alert('Message sent successfully!');
    } else {
      alert('Failed to send message. Please try again later.');
    }
  }
  return (
    <section className="flex items-center justify-center w-full px-4 lg:px-1  bg-[#FAF9F8] pb-20 md:pb-24 lg:pb-28 pt-20 md:pt-22 lg:pt-24">
      <div className="absolute z-0 -top-[15%] -left-[378px] opacity-20">
        <img
          src="/contact-bg.png"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-15 z-10">
        <div className="flex flex-col gap-[66px] z-10">
          <div className="flex flex-col gap-9">
            <h1 className="text-[#1E293B] font-sora font-bold text-[32px] md:text-[56px] leading-[1] tracking-normal ">
              Get In <span style={{ color: COLORS.brandRed }}>Touch</span>
            </h1>
            <p className="font-inter font-normal text-[12px] md:text-[18px] text-[#505050] xl:max-w-[653px] leading-[28px] tracking-normal">
              We’d love to hear from you, whether you’re a listener with a
              question, a researcher with an idea, or a partner exploring
              collaboration opportunities in brain health and longevity.
            </p>
          </div>
          <div className="flex md:flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <h1 className="font-sora font-bold text-[16px] md:text-[32px] text-[#1E293B] leading-[1] tracking-normal">
                Call Us
              </h1>
              <div className="flex items-center justify-center gap-3">
                <img src="/phone.png" alt="" />
                <p className="font-inter font-bold text-[12px] md:text-[18px] text-[#505050] leading-[1] tracking-normal">
                  +1-323-453-5817
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <h1 className="font-sora font-bold text-[16px] md:text-[32px] text-[#1E293B] leading-[1] tracking-normal">
                Email Us
              </h1>
              <div className="flex items-center justify-center gap-3">
                <img src="/email.png" alt="" />
                <p className="font-inter font-bold text-[12px] md:text-[18px] text-[#505050] leading-[1] tracking-normal">
                  info@brainmeetsbytes
                </p>
              </div>
            </div>
          </div>
          <div>
            <button className="flex items-center justify-between w-full lg:w-1/2 xl:w-[185px] h-[50px] pl-8 pr-2 bg-[#023047] font-sora font-bold text-[18px] leading-[24px] tracking-normal text-[#F2F2F2] rounded-[50px]">
              Live Chat{" "}
              <span className="w-[34px] h-[34px] rounded-[52px] opacity-100 rotate-0 bg-[#FAF9F8] flex items-center justify-center">
                <ArrowRight className="text-[#023047]" />
              </span>
            </button>
          </div>
        </div>
        {/* Form */}
        <div className="w-full lg:w-fit">
          <form
            className=" rounded-3xl bg-[#FAF9F8] p-4 md:p-8 shadow-lg border border-[#E2E8F0] text-[#1E293B] placeholder:text-[#0505050]"
            method="post"
            noValidate
            onSubmit={handleSubmit}
          >
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  autoComplete="given-name"
                  value={contactData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-full border border-gray-200 px-5 py-3 text-sm outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  autoComplete="family-name"
                  value={contactData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-full border border-gray-200 px-5 py-3 text-sm outline-none focus:border-gray-400"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mt-6">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Email ID
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email ID"
                autoComplete="email"
                value={contactData.email}
                onChange={handleInputChange}
                required
                className="w-full rounded-full border border-gray-200 px-5 py-3 text-sm outline-none focus:border-gray-400"
              />
            </div>

            {/* Message */}
            <div className="mt-6">
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                How can we help you
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Message"
                rows={5}
                value={contactData.message}
                onChange={handleInputChange}
                required
                className="w-full resize-none rounded-2xl border border-gray-200 px-5 py-4 text-sm outline-none focus:border-gray-400"
              />
            </div>

            {/* Submit */}
            <div className="mt-8">
              <button
                type="submit"
                className="flex items-center justify-between w-full xl:w-[136px] md:-h-[44px] text-[18px] gap-2 rounded-full bg-[#D62828] px-8 py-3 text-sm font-semibold text-white"
              >
                Send
                <img src="/send.png" alt="" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
