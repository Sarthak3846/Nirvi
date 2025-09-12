import React, { useMemo, useState, useEffect } from "react";

interface ParsingResumePopupProps {
  onComplete?: () => void;
  message?: string;
  videoSrc?: string;
  forParsing: boolean;
  title: string
}

export const ParsingResumePopup: React.FC<ParsingResumePopupProps> = ({
  onComplete,
  message,
  videoSrc,
  forParsing,
  title,
}) => {
  // Placeholder for your MP4 file
  const documentIcon = useMemo(
    () => (
      <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 flex items-center justify-center">
        {videoSrc ? (
          <video
            autoPlay
            loop
            muted
            className="w-full h-full rounded-md object-cover"
          >
            <source src={videoSrc}  type="video/webm"  />

            Your browser does not support the video tag.

          </video>
        ) : (
          <div className="bg-gray-700 w-full h-full rounded-md flex items-center justify-center">
            <span className="text-xs text-white">Resume</span>
          </div>
        )}
      </div>
    ),
    [videoSrc],
  );

  // Animation for the glow effect - using state to control animations
  const [dots, setDots] = useState("");

  // Glow effect animation hook
  useEffect(() => {

    // Loading dots animation
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    return () => {
      clearInterval(dotsInterval);
    };
  }, [onComplete]);


  // The main render using pure function approach
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 p-3 sm:p-4 z-[9999]">

      {/* Main popup container - responsive with better mobile layout */}
      <div
        className="relative flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 w-full max-w-xs sm:max-w-2xl lg:max-w-4xl bg-[#080C14] py-4 sm:py-6 pb-6 sm:pb-12 px-4 sm:px-6 lg:px-10 rounded-lg text-white overflow-hidden border border-neutral-800 shadow-[0_0_150px_rgba(25,96,151,0.7)]"
           style={{ zIndex: 9999 }}
      >
        {/* Video container - centered on mobile */}
        <div className="flex flex-col items-center gap-2 sm:gap-4 text-center">
          <div className="flex-shrink-0">{documentIcon}</div>
        </div>

        {/* Content container - adjusted for mobile */}
        <div className="relative z-10 flex flex-col gap-1 sm:gap-2 mt-2 sm:mt-6 justify-center items-center sm:items-start text-center sm:text-start">

          <p className="text-yellow-400 text-xs sm:text-sm tracking-widest font-semibold">
            PLEASE STAND BY{dots}
          </p>

          <div className="flex flex-col gap-1 sm:gap-2">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-100 leading-tight">{title}</h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed">
              <span className="font-bold">{forParsing? 'Note:' : 'Pro Tip:'}</span> {message}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
