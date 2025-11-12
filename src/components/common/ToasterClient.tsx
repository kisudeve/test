"use client";

import { Toaster } from "sonner";
import { paperlogy } from "@/../public/fonts/local_fonts";

export function ToasterClient() {
  return (
    <Toaster
      theme="system"
      style={{ fontFamily: paperlogy.style.fontFamily }}
      position="bottom-right"
    />
  );
}
