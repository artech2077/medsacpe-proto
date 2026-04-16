"use client";

import { useEffect, useState } from "react";

type MedscapeCurrentAdBlockProps = {
  className?: string;
};

export function MedscapeCurrentAdBlock({ className = "" }: MedscapeCurrentAdBlockProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const syncViewport = () => setIsDesktop(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => {
      mediaQuery.removeEventListener("change", syncViewport);
    };
  }, []);

  return (
    <aside
      className={`border border-[#C5CED3] bg-[#F2F2F2] px-5 py-5 text-center ${className}`.trim()}
      aria-label="Advertisement"
    >
      <div className="mx-auto h-[250px] w-[300px] max-w-full overflow-hidden md:h-[90px] md:w-[728px]">
        <img
          src={isDesktop ? "/assets/Salutrib_728x90.png" : "/assets/ad.png"}
          alt="Salutrib advertisement"
          className="block h-full w-full object-cover"
        />
      </div>
      <p className="mt-1 pt-1 text-[12px] leading-[12px] text-[#435056]">
        Advertisement
      </p>
    </aside>
  );
}
