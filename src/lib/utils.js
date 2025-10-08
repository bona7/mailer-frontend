import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getAccountColor = (account) => {
  const colorMap = {
    first: "bg-account-first",
    second: "bg-account-second",
    third: "bg-account-third",
  };
  return colorMap[account] || colorMap["first"];
};
