import React from "react";
import MainNav from "./main-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-dvh max-w-4xl mx-auto w-full">
      <MainNav />
      {children}
    </div>
  );
}
