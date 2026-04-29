import LoadingDots from "./LoadingDots";

export default function LoadingMessage() {
  return (
    <div className="flex items-start justify-start gap-3">
      <div className="h-10 w-10 min-w-10 rounded-full bg-[#004994]" />

      <div className="rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <LoadingDots />
      </div>
    </div>
  );
}
