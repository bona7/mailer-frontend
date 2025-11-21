import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getAccountColor = (emailAddress) => {
  const colors = ["bg-[#C47B7B]", "bg-[#B441CE]", "bg-[#82B658]"];
  if (!emailAddress) return colors[0]; // 기본 색상

  // 이메일 주소 전체를 해시하여 고유한 색상 인덱스 생성
  let hash = 0;
  for (let i = 0; i < emailAddress.length; i++) {
    hash = emailAddress.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
};
