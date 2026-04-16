type MedscapeCurrentAdBlockProps = {
  className?: string;
};

export function MedscapeCurrentAdBlock({ className = "" }: MedscapeCurrentAdBlockProps) {
  return (
    <aside
      className={`border border-[#C5CED3] bg-[#F2F2F2] px-5 py-5 text-center ${className}`.trim()}
      aria-label="Advertisement"
    >
      <div className="mx-auto flex h-[250px] w-[300px] max-w-full items-center justify-center bg-[#C0D5F2] text-center text-[20px] leading-[24px] font-medium text-[#064AA7] md:h-[90px] md:w-[728px]">
        <span>
          <span className="md:hidden">300x250</span>
          <span className="hidden md:inline">728x90</span>
          <br />
          ad placeholder
        </span>
      </div>
      <p className="mt-1 pt-1 text-[12px] leading-[12px] text-[#435056]">
        Advertisement
      </p>
    </aside>
  );
}
