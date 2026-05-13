export default function ContentCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full  max-w-200 bg-white  shadow-[8px_8px_12px_rgba(0,0,0,0.25)]">
      {children}
    </div>
  );
}
