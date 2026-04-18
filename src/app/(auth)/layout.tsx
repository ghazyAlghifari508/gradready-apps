import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { ToastProvider } from "@/components/ui/Toast";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return (
    <ToastProvider>
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-gray)" }}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <Sidebar />
          <main
            style={{
              flex: 1,
              padding: 0,
              minHeight: "calc(100vh - 64px)",
              maxWidth: "calc(100vw - 240px)",
              overflowX: "hidden",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
