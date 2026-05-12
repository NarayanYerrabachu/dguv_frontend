export default function ContentCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full max-w-[650px] bg-white pt-16 px-20 pb-8 shadow-[8px_8px_12px_rgba(0,0,0,0.25)]">
      {children}
    </div>
  );
}
