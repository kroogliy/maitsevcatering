import localFont from "next/font/local";

import {
  Montserrat,
  Literata,
  Lora,
  Spectral,
  Fraunces,
  Noto_Sans_Georgian,
  Forum,
  Merriweather,
  Poppins,
  Inter,
  Rubik,
  Jost,
} from "next/font/google";

export const jost = Jost({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-jost",
});

export const rubik = Rubik({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-rubik",
});

export const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-inter",
});

export const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-poppins",
});

export const merriweather = Merriweather({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-merriweather",
});

export const forum = Forum({
  weight: ["400"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-forum",
});

export const georgian = Noto_Sans_Georgian({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-georgian",
});

export const fraunces = Fraunces({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-fraunces",
});

export const spectral = Spectral({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-spectral",
});

export const lora = Lora({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-lora",
});

export const literata = Literata({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-literata",
});

export const montserrat = Montserrat({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-montserrat",
});
