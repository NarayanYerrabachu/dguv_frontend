// export default function ContentCard({ children }: { children: React.ReactNode }) {
//   return (
//     <div
//       className="
//         relative
//         box-border
//         w-full mt-20 max-w-206 min-h-162 aspect-[18/18]
//         bg-white
//         mb-6
//         pt-[4%]
//         px-[12%]
//         pb-[4%]
//         shadow-[8px_8px_12px_rgba(0,0,0,0.25)]
//         [container-type:inline-size]
//       "
//     >
//       {children}
//     </div>
//   );
// }
export default function ContentCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full mt-20 max-w-206  min-h-162 
     bg-white  pt-24 px-46 pb-8 shadow-[8px_8px_12px_rgba(0,0,0,0.25)]">
      {children}
    </div>
  );
}
