import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="flex">
        <Sidebar open={open} onToggle={() => setOpen(!open)} />
        <div className="flex-1 min-w-0">
          <Navbar onToggleSidebar={() => setOpen(!open)} />
          <main className="p-4 sm:p-6 max-w-7xl mx-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
