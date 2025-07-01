import React from "react";

export const ProgressBox = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center">
    {children}
  </div>
);

export const AllPeopleMain = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-[1580px] relative m-auto xl:py-3 xl:px-0">
    {children}
  </div>
);

export const PeopleContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="shadow-md transition-shadow rounded-[5px] relative block">
    {children}
  </div>
);

export const NavBarTitle = ({ children }: { children: React.ReactNode }) => (
  <span className="font-semibold leading-[130%] text-white">
    {children}
  </span>
);

export const NavBarBtn = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className="py-3 px-5 rounded-[6px] border-2 border-white text-white text-[16px] leading-[150%] font-bold bg-primary-900 hover:text-primary-900 hover:bg-white transition-colors"
    {...props}
  >
    {children}
  </button>
);

export const DarkBtn = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className="bg-primary-600 py-3 px-5 text-[16px] font-bold text-white border-2 border-primary-600 leading-[150%] hover:bg-primary-600 transition-colors rounded-[6px]"
    {...props}
  >
    {children}
  </button>
);

export const ImgBtn = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className="w-[34px] h-[34px] min-w-[34px] border-2 border-primary-600 rounded"
    {...props}
  >
    {children}
  </button>
);

export const StackContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full h-full overflow-x-auto py-6 px-9 sm:py-3 sm:px-3 relative">
    {children}
  </div>
);
