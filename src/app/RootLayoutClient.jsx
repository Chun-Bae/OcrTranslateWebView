"use client";

import { NextUIProvider } from "@nextui-org/react";

export default function RootLayoutClient({ children }) {
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  );
}
