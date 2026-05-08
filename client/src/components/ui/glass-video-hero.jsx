import { useState } from "react";
import { Link } from "react-router-dom";
import { Maximize2, Minimize2, Leaf, ArrowRight } from "lucide-react";

const HeroSection = () => {
  const [fullBleed, setFullBleed] = useState(true);

  const VIDEO_URL =
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4";

  return (
    <section
      className={`relative w-full overflow-hidden transition-all duration-500 ease-in-out ${
        fullBleed ? "min-h-screen" : "py-32 lg:py-40"
      }`}
    >
      {/* Height Toggle */}
      <button
        onClick={() => setFullBleed(!fullBleed)}
        aria-label={fullBleed ? "Switch to fit-to-content" : "Switch to full-bleed"}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-[10px] backdrop-blur-xl border border-[rgba(134,239,172,0.4)] bg-[rgba(22,101,52,0.4)] text-white hover:bg-[rgba(22,101,52,0.6)] transition-all focus:outline-none"
      >
        {fullBleed ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>

      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Fallback gradient background if video fails */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-green-950 via-green-900 to-emerald-800" />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center mt-32 px-6">
        {/* Tagline Pill */}
        <div className="inline-flex items-center gap-2.5 h-[38px] px-3.5 rounded-[10px] backdrop-blur-xl border border-[rgba(134,239,172,0.5)] bg-[rgba(22,101,52,0.4)] shadow-[0_0_20px_rgba(34,197,94,0.15),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <span className="bg-green-500 text-white font-cabin font-medium text-xs px-2.5 py-1 rounded-[6px] shadow-[0_0_8px_rgba(34,197,94,0.4)] flex items-center gap-1">
            <Leaf size={11} /> Join Now
          </span>
          <span className="font-cabin font-medium text-sm text-white tracking-wide">
            Together we can end food waste
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-instrument text-white text-5xl lg:text-[88px] leading-[1.05] tracking-[-0.02em] mt-8 max-w-5xl">
          Reduce Waste,{" "}
          <em className="italic">Feed</em>{" "}
          Communities,
          <br className="hidden lg:block" />
          Make an Impact
        </h1>

        {/* Subtext */}
        <p className="font-inter font-normal text-lg text-white/75 mt-6 max-w-[662px]">
          Connecting restaurants, hostels, and event organizers with NGOs and
          communities in need. List your surplus food today and help fight
          hunger — one meal at a time.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[10px] bg-green-600 text-white font-cabin font-semibold text-base hover:bg-green-500 transition-all shadow-lg shadow-green-900/40"
          >
            Start Donating <ArrowRight size={18} />
          </Link>
          <Link
            to="/donations"
            className="px-8 py-3.5 rounded-[10px] backdrop-blur-xl border border-white/30 bg-white/10 text-white font-cabin font-medium text-base hover:bg-white/20 transition-all"
          >
            Browse Donations
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 pb-12">
          {[
            { value: "10,000+", label: "Meals Donated" },
            { value: "500+", label: "Active Donors" },
            { value: "200+", label: "NGOs Partnered" },
            { value: "50 Tons", label: "Waste Reduced" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-cabin font-bold text-3xl text-white">{stat.value}</div>
              <div className="font-inter text-sm text-white/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { HeroSection };
