
export default function ContentCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-208 max-w-208 aspect-[20/15] shrink-0
    min-[2100px]:h-185 min-[2100px]:w-auto min-[2100px]:aspect-[20/18]
     bg-white shadow-[8px_8px_12px_rgba(0,0,0,0.25)] flex items-center justify-center">
      <div className="w-[60%] h-[70%] ">
        {children}
      </div>
    </div>
  );
}
