export default function BlueBox({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full bg-white py-6">
      <div className="w-full min-h-[800px] max-w-[1700px] mx-auto bg-[#d8eefc] shadow-[8px_8px_8px_rgba(0,0,0,0.25)] px-10 py-30 flex items-center justify-center">
        {children}
      </div>
    </section>
  );
}
