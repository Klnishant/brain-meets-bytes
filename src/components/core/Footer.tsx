import { NAV_LINKS } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="w-full bg-white shadow-md">
      <div className=" mx-auto px-4 sm:px-6 lg:px-16 py-12 md:py-16 flex flex-col gap-10 md:gap-14">
        {/* Top section: columns */}
        <div className="flex flex-col gap-10 lg:gap-0 md:flex-row md:items-start md:justify-between">
          {/* About / logo */}
          <div className="w-full md:max-w-sm flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <img
                src="/logo.png"
                alt="Brain Meets Bytes logo"
                className="w-44 h-auto object-contain"
              />
              <p className="font-inter text-sm md:text-base leading-7 text-[#505050] max-w-md">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae
                hendrerit lectus. Praesent vitae consequat mi. Maecenas auctor sed
                sapien ut bibendum. Nam in viverra justo.
              </p>
            </div>
          </div>

          {/* Menu */}
          <div className="w-full md:w-auto flex flex-col gap-6 ml-5">
            <h3 className="font-sora text-lg md:text-xl font-bold text-[#1E293B]">
              Menu
            </h3>
            <nav className="flex flex-col gap-4 font-inter text-sm md:text-base">
              {NAV_LINKS.map((item) => (
                <button
                  key={item}
                  className={`text-left ${
                    item === "Home"
                      ? "font-semibold text-[#D62828]"
                      : "font-normal text-[#1E293B] opacity-50 hover:opacity-80"
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          {/* Important */}
          <div className="w-full md:w-auto flex flex-col gap-6 ml-5">
            <h3 className="font-sora text-lg md:text-xl font-bold text-[#1E293B]">
              Important
            </h3>
            <div className="flex flex-col gap-3 font-inter text-sm md:text-base text-[#505050]">
              <span>Refund Policy</span>
              <span>Privacy Policy</span>
              <span>Terms &amp; Conditions</span>
              <span>Forum terms</span>
            </div>
          </div>

          {/* Contact */}
          <div className="w-full md:w-auto flex flex-col gap-6 ml-5">
            <h3 className="font-sora text-lg md:text-xl font-bold text-[#1E293B]">
              Contact
            </h3>
            <div className="flex flex-col gap-4 font-inter text-sm md:text-base text-[#505050]">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                  <img
                    src="/phone.png"
                    alt="Phone"
                    className="w-3.5 h-3.5 object-contain"
                  />
                </div>
                <span>(123) 456 – 7890</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                  <img
                    src="/email.png"
                    alt="Email"
                    className="w-3.5 h-3.5 object-contain"
                  />
                </div>
                <span>Example@email.com</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center mt-1">
                  <img
                    src="/location.png"
                    alt="Location"
                    className="w-3.5 h-3.5 object-contain"
                  />
                </div>
                <span>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full" style={{ backgroundColor: "#D62828" }} />

        {/* Bottom: Follow us + socials */}
        <div className="flex flex-row items-center justify-between gap-6">
          <h3 className="font-sora text-lg md:text-xl font-bold text-[#1E293B]">
            Follow us
          </h3>

          <div className="flex items-center gap-3 md:gap-6">
            {["instagram", "facebook", "x", "linkedin"].map((name) => (
              <button
                key={name}
                aria-label={name}
                className="relative w-12 h-12 rounded-full bg-[#F5F5F5] shadow-inner flex items-center justify-center"
              >
                <img
                  src={`/${name}.png`}
                  alt={name}
                  className="w-6 h-6 object-contain"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;