type MedscapeCurrentAdBlockProps = {
  className?: string;
};

export function MedscapeCurrentAdBlock({ className = "" }: MedscapeCurrentAdBlockProps) {
  return (
    <aside
      className={`border border-[#d5dce2] bg-[#f7f7f7] px-4 py-4 text-center md:px-6 ${className}`.trim()}
      aria-label="Advertisement"
    >
      <div className="mx-auto flex h-[250px] w-[300px] max-w-full items-center justify-center bg-[#07111f] text-center text-[18px] leading-[1.25] font-semibold text-white md:h-[90px] md:w-[728px]">
        <span>
          <span className="md:hidden">300x250</span>
          <span className="hidden md:inline">728x90</span>
          <br />
          ad placeholder
        </span>
      </div>
      <p className="mt-2 text-[11px] leading-none text-[#6f7982] md:text-[10px]">
        Advertisement
      </p>
    </aside>
  );
}
