
export default function ContentCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full sm:w-208 sm:max-w-208 sm:aspect-[20/15] shrink-0
    min-[2100px]:h-185 min-[2100px]:w-auto min-[2100px]:aspect-[20/18]
     bg-white shadow-[8px_8px_12px_rgba(0,0,0,0.25)] flex items-center justify-center px-6 pt-14 pb-6 sm:p-0 overflow-visible">
      <div className="w-full sm:w-[60%] min-[2100px]:w-[54%] flex flex-col h-full sm:h-auto">
        {children}
      </div>
    </div>
  );
}
