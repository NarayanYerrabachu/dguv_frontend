export default function BlueBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-[72px] h-[calc(100vh-182px)] w-full bg-white px-19 py-[8px]">
      <div className="relative flex h-full w-full flex-col bg-[#d4edfc] overflow-y-auto 
     shadow-[5px_5px_10px_rgba(0,0,0,0.35)] ">
        {children}
      </div>
    </div>
  );
}
