import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getAccountColor = (emailAddress) => {
  const colors = ["bg-[#C47B7B]", "bg-[#B441CE]", "bg-[#82B658]"];
  if (!emailAddress) return colors[0]; // 기본 색상

  const charCode = emailAddress.charCodeAt(0);
  const colorIndex = charCode % colors.length;
  return colors[colorIndex];
};
