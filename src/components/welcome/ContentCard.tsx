export default function ContentCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full max-w-[830px] bg-white pt-[48px] px-[183px] pb-[24px] shadow-[rgba(0,0,0,0.23)_7px_7px_5px_0px]">
      {children}
    </div>
  );
}
