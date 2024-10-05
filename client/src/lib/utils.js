import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import animationData from "@/assets/lottie-json"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
 export const colors = [
  "bg-[#772c4a57] text-[#ff006a] border-[1px] border-[#ff006a]",
  "bg-[#ff6d6a] text-[#ff006a] border-[1px] border-[#ff6d6a]",
  "bg-[#ff6d6a2a] text-[#e6006a] border-[1px] border-[#e6006a]",
  "bg-[#44cc9f0a] text-[#44cc9f] border-[1px] border-[#44cc9fbb]"
];

export const getColor = (color) => {
  if (color >= 0 && color < colors.length) {
      return colors[color];
  }
  return colors[0]; // Fallback to the first color if out of range
};


export const anmationDefaultOptions = {
  loop:true,
  autoplay:true,
  animationData : animationData
}