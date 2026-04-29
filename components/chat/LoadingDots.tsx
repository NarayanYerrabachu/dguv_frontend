export default function LoadingDots() {
  return (
    <div className="flex gap-1.5">
      {[0, 0.2, 0.4].map((delay, i) => (
        <div
          key={i}
          className="h-2 w-2 animate-bounce rounded-full bg-[#004994] [animation-duration:1.4s]"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}
