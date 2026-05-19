export default function LoadingDots() {
  return (
    <div className="flex items-center gap-2 py-1">
      {[0, 0.18, 0.36].map((delay, i) => (
        <div
          key={i}
          className="h-3 w-3 rounded-full bg-[#004994]"
          style={{
            animation: `typingDot 1.2s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}
