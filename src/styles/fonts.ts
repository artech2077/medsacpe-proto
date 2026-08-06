import { EB_Garamond, Geist_Mono, Nunito_Sans } from "next/font/google";

export const prototypeSans = Nunito_Sans({
  variable: "--font-prototype-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const prototypeMono = Geist_Mono({
  variable: "--font-prototype-mono",
  subsets: ["latin"],
});

export const prototypeDisplay = EB_Garamond({
  variable: "--font-prototype-display",
  subsets: ["latin"],
  weight: "variable",
});

export const localFontDropPath = "src/assets/fonts";
