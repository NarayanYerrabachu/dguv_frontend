export default function ContentCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[650px] relative">
      <div className="bg-white shadow-[8px_8px_12px_rgba(0,0,0,0.25)] pt-16 px-20 pb-8">
        {children}
      </div>
    </div>
  );
}
