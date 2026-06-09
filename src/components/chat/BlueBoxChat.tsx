export default function BlueBoxChat({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-[72px] h-[calc(100vh-210px)] w-full bg-white py-[8px]">
      <div
        className="
          relative
          mx-auto
          flex
          h-full
          w-[94vw]
          flex-col
          overflow-y-auto
          bg-[#d4edfc]
          shadow-[5px_5px_10px_rgba(0,0,0,0.35)]
          px-6
        "
      >
        {children}
      </div>
    </div>
  );
}
