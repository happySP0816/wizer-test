import React from "react";

export const AddNewBox: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="flex flex-col justify-center items-center p-2.5">
    {children}
  </div>
);

export const AddNewForm: React.FC<React.FormHTMLAttributes<HTMLFormElement>> = ({ children, ...props }) => (
  <form className="flex flex-col gap-2.5 relative w-full max-w-xs" {...props}>
    {children}
  </form>
);

export const AddNewInputLabel: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, ...props }) => (
  <label className="text-sm font-semibold leading-4" {...props}>
    {children}
  </label>
);

export const AddNewInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    className="h-12 rounded-md border-2 border-[#CBD2E0] p-3 text-base font-normal leading-[150%]"
    {...props}
  />
);
