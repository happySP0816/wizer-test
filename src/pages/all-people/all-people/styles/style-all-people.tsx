import React from "react";

export const tableCellBorder = '2px solid #DBDBDB';

export const AllPeopleTableBox: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="flex items-center gap-2.5 max-h-[82px] bg-[#FCFCFC]">
    {children}
  </div>
);

export const AllPeopleTableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ children, ...props }) => (
  <td
    className="border-r-[2px] border-[#DBDBDB] p-[22px] capitalize"
    {...props}
  >
    {children}
  </td>
);

export const TableText: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ children, ...props }) => (
  <span className="text-[20px] font-medium w-fit" {...props}>
    {children}
  </span>
);

export const WhiteBtnCard: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <button
    className="px-5 py-3 rounded-md ml-1.5 border-2 border-white text-white text-[15px] leading-[150%] font-semibold bg-[#7B69AF] hover:text-[#7B69AF] hover:bg-white transition-colors"
    {...props}
  >
    {children}
  </button>
);
