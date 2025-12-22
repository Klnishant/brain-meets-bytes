import AudioCard from "./AudioCard";
import { COLORS } from "@/lib/constants";

const Hero = () => {
  return (
    <section
      className="py-20  bg-[url('/hero-bg-wave.png')]
    bg-no-repeat
    bg-absolute
    bg-[length:auto_78.5%]
    md:bg-[length:auto_120%]
    bg-[position:71%_-70%]
    md:bg-[position:102%_center]
    "
      
    >
      <div className="mx-auto flex flex-col-reverse md:flex-row md:grid-cols-[3fr_2fr] gap-[150px] md:gap-16 items-center px-4 sm:px-6 lg:px-16">
        {/* LEFT CONTENT: Text + Buttons */}
        <div className="flex flex-col items-start gap-6 md:gap-10 max-w-3xl">
          {/* BADGE */}
          <button
            className="inline-flex items-center justify-center px-7 py-2.5 rounded-full text-sm md:text-base font-light"
            style={{ backgroundColor: COLORS.badgeBg, color: COLORS.brandMutedText }}
          >
            Cutting-edge Brain Science &amp; Longevity
          </button>

          {/* HEADING */}
          <div className="flex-col gap-3">
            <h1 className="font-sora font-bold  text-[32px] md:text-2xl lg:text-5xl leading-snug md:leading-[3.2rem] lg:leading-tight text-[#1E293B]">
              <span className="block">Exploring the Breakthroughs</span>
              <span className="block">
                Advancing <span className="text-[#D62828]">Brain Health</span>
                <span> &amp; Longevity.</span>
              </span>
            </h1>

            {/* PARAGRAPH */}
            <p className="font-inter max-w-2xl text-xs md:text-sm lg:text-base leading-7 text-[#505050]">
              Conversations with the world’s leading experts in brain health and
              human longevity distilled into insights you can trust.
            </p>
          </div>

          {/* CTA BUTTONS */}
          <div className="flex md:flex-col sm:flex-row items-start gap-3 md:gap-5">
            {/* PRIMARY CTA BUTTON */}
            <button
              className="inline-flex items-center justify-between gap-3 text-white rounded-full pl-4 md:pl-6 pr-1.5 md:pr-2 py-2 shadow-sm hover:shadow-md transition-shadow"
              style={{ backgroundColor: COLORS.brandRed }}
            >
              <span className="text-sm md:text-base font-medium whitespace-nowrap">
                Watch Latest Episode
              </span>

              {/* WHITE CIRCLE + PLAY ICON */}
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white">
                <span
                  className="inline-block w-2.5 h-3.5 [clip-path:polygon(0%_0%,100%_50%,0%_100%)]"
                  style={{ backgroundColor: COLORS.brandRed }}
                />
              </span>
            </button>

            {/* SECONDARY BUTTON */}
            <button
              className="relative inline-flex items-center justify-center px-2 md:px-6 py-4 md:py-3.5 rounded-full border-2 text-sm md:text-base font-medium overflow-hidden transition duration-200 ease-out hover:text-white hover:-translate-y-0.5"
              style={{
                borderColor: COLORS.brandNavy,
                color: COLORS.brandNavy,
                backgroundColor: "transparent",
              }}
            >
              <span className="relative z-10 ">Become a member</span>
            </button>
          </div>

          {/* SUBTEXT */}
          <p
            className="mt-3 text-xs md:text-sm font-medium"
            style={{ color: COLORS.accentOrange }}
          >
            New episodes weekly • Evidence-based discussions
          </p>
        </div>

        {/* RIGHT: AUDIO CARD */}
        <div className="flex justify-end mx-auto">
          <AudioCard />
        </div>
      </div>
    </section>
  );
};

export default Hero;
