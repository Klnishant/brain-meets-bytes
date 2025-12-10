import { COLORS } from "@/lib/constants";

type ForumCardProps = {
  faded?: boolean;
  className?: string;
};

const ForumCard = ({ faded, className }: ForumCardProps) => {
  return (
    <div
      className={`rounded-2xl border border-[#E2E8F0] bg-white shadow-md px-6 md:px-8 py-6 md:py-8 flex flex-col gap-6 ${
        faded ? "opacity-60" : ""
      } ${className ?? ""}`}
    >
      {/* Header: avatar + meta + flag */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-[#F77F00] overflow-hidden">
              <img
                src="/forum-user-1.jpg"
                alt="Sara Jones avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <span className="font-inter text-base font-normal text-[#1E293B]">
                  Sara Jones
                </span>
                <span className="inline-block w-px h-4 bg-[#64748B] rounded-full" />
                <span className="font-inter text-sm font-light text-[#64748B]">3 days ago</span>
              </div>
              <span className="font-inter text-xs font-semibold text-[#505050]">Member</span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#64748B] text-[11px] text-white font-inter">
              Episode Discussion
            </span>
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-[#64748B] text-[11px] text-[#64748B] font-inter">
              18 replies
            </span>
          </div>
        </div>

        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#D62828]">
          <img src="/flag.png" alt="Flag post" className="w-4 h-4 object-contain" />
        </button>
      </div>

      {/* Title + body */}
      <div className="flex flex-col gap-3">
        <h3 className="font-sora text-xl md:text-2xl font-semibold text-black">
          Key takeaways from 
          <span className="italic">“The Future of Cognitive Enhancement”</span>
        </h3>
        <p className="font-inter text-sm md:text-base text-[#333333] leading-7">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc interdum egestas eleifend.
          Nulla est tortor, iaculis eu iaculis ut, congue at sapien. Mauris gravida congue
          vulputate. Suspendisse vitae magna at sem vehicula porttitor.
        </p>
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#64748B] bg-white">
            <img
              src="/comment.png"
              alt="Comments"
              className="w-3.5 h-3.5 object-contain"
            />
            <span className="font-inter text-xs md:text-sm text-[#64748B]">245</span>
          </button>

          <button className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#64748B] bg-white">
            <img
              src="/vote-arrow.png"
              alt="Upvote"
              className="w-3.5 h-3.5 object-contain"
            />
            <span className="font-inter text-xs md:text-sm text-[#64748B]">6</span>
            <img
              src="/vote-arrow.png"
              alt="Downvote"
              className="w-3.5 h-3.5 object-contain rotate-180"
            />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#64748B] bg-white">
            <span className="font-inter text-xs md:text-sm text-[#64748B]">Share</span>
          </button>
          <button className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#64748B] bg-white">
            <img src="/save.png" alt="Save post" className="w-3.5 h-3.5 object-contain" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AboutJoinCommunitySection = () => {
  return (
    <section className="w-full bg-[#FAF9F8] py-20 md:py-30 lg:py-40">
      <div className="mx-auto px-4 sm:px-6 lg:px-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left: text + CTA */}
        <div className="w-full max-w-xl flex flex-col items-start gap-8 order-1 lg:order-0">
          <div className="flex flex-col gap-4">
            <h2 className="font-sora text-2xl md:text-3xl lg:text-4xl font-bold text-black">
              Join the <span style={{ color: COLORS.brandRed }}>Conversation</span>
            </h2>
            <p className="font-inter text-sm md:text-base text-[#505050] leading-7">
              Breakthroughs don&apos;t happen alone.
            </p>
            <p className="font-inter text-sm md:text-base text-[#505050] leading-7">
              Join a community of curious minds, health innovators, and lifelong learners who are
              passionate about advancing smarter brain health and longevity. Share ideas, ask
              questions, and grow together as we shape the future of human health.
            </p>
          </div>

          <button
            className="inline-flex items-center justify-center px-8 md:px-10 py-3 rounded-full text-sm md:text-base text-white"
            style={{ backgroundColor: COLORS.brandRed }}
          >
            Join Now!
          </button>
        </div>

        {/* Right: stacked forum cards (horizontal fan) */}
        <div className="relative w-full max-w-[662px] h-[400px] md:h-[420px] order-2 lg:order-none">
          {/* Back left card */}
          <ForumCard
            faded
            className="absolute top-0 left-10 w-full max-w-sm scale-90"
          />

          {/* Back right card */}
          <ForumCard
            faded
            className="absolute top-0 right-10 w-full max-w-sm scale-90"
          />

          {/* Front center card */}
          <ForumCard
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-sm z-10"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutJoinCommunitySection;
