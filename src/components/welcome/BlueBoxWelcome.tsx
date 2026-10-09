export default function BlueBoxWelcome({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-[72px] min-h-[calc(100vh-210px)] sm:h-[calc(100vh-210px)] w-full bg-white py-[8px]">
      <div
        className="
          relative
          mx-auto
          flex
          min-h-full
          w-full
          sm:w-[92vw]
          flex-col
          overflow-y-auto
          overflow-x-hidden
          bg-[#d4edfc]
          shadow-[5px_5px_10px_rgba(0,0,0,0.35)]
          pb-8
        "
      >
        {children}
      </div>
    </div>
  );
}
