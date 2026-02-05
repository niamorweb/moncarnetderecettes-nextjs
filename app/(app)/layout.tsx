"use client";

import AppSidebar from "@/components/global/AppSidebar";
import AppBottomNav from "@/components/global/AppBottomNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <AppSidebar />
      <div className="md:ml-64 pb-20 md:pb-0">{children}</div>
      <AppBottomNav />
    </div>
  );
}
