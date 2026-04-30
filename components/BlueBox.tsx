export default function BlueBox({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full bg-white py-6">
      <div className="relative mx-auto h-[800px] w-full max-w-[1740px] bg-[#d8eefc] px-10 py-8 shadow-[8px_8px_8px_rgba(0,0,0,0.25)]">
        {children}
      </div>
    </section>
  );
}