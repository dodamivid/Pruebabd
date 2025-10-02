import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 text-neutral-900">
      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((value) => !value)} />
        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar onToggleSidebar={() => setSidebarOpen((value) => !value)} />
          <main className="flex-1 px-5 py-8 md:px-8 lg:px-10">
            <div className="mx-auto w-full max-w-6xl space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

