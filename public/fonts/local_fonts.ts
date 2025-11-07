import localFont from "next/font/local";

export const paperlogy = localFont({
  src: [
    {
      path: "./local/Paperlogy-1Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "./local/Paperlogy-2ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./local/Paperlogy-3Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./local/Paperlogy-4Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./local/Paperlogy-5Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./local/Paperlogy-6SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./local/Paperlogy-7Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./local/Paperlogy-8ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./local/Paperlogy-9Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-paperlogy",
  display: "swap",
});
