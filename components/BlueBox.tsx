export default function BlueBox({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full bg-white px-6 py-20">
      <div className="relative mx-auto flex h-[calc(100vh-160px)]  max-h-195 w-full max-w-425 flex-col overflow-hidden bg-[#d8eefc] px-3 py-4 shadow-[4px_4px_8px_rgba(0,0,0,0.2)] sm:px-6 sm:py-6 md:px-8 lg:px-10">
        {children}
      </div>
    </section>
  );
}