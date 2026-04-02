import { Geist_Mono, Nunito_Sans } from "next/font/google";

export const prototypeSans = Nunito_Sans({
  variable: "--font-prototype-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const prototypeMono = Geist_Mono({
  variable: "--font-prototype-mono",
  subsets: ["latin"],
});

export const localFontDropPath = "src/assets/fonts";
