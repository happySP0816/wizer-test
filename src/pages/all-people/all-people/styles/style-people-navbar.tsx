import React from "react";

export function StackContainerNav({ children, mb }: { children: React.ReactNode, mb?: string }) {
  return (
    <div
      className="
        rounded-tl-[5px] rounded-tr-[5px] bg-[#7B69AF]
        flex flex-row items-center justify-between px-10 py-8
        sm:flex-col sm:gap-5 sm:p-6 sm:justify-center
        ${mb ? `mb-${mb}` : ''}
      "
    >
      {children}
    </div>
  );
}
