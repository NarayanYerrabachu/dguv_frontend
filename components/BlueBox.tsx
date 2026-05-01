export default function BlueBox({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full bg-white px-6 py-6">
      <div className="relative mx-auto flex h-[calc(100vh-200px)] min-h-125 w-full max-w-300 flex-col overflow-hidden bg-[#d8eefc] px-10 py-8 shadow-[8px_8px_8px_rgba(0,0,0,0.25)]">
        {children}
      </div>
    </section>
  );
}