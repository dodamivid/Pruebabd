import type { ComponentType } from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  RectangleStackIcon,
  ClipboardDocumentListIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

type SidebarProps = {
  open: boolean;
  onToggle: () => void;
};

type NavItem = {
  to: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { to: "/home", label: "Inicio", description: "Resumen general", icon: HomeIcon },
  { to: "/productos", label: "Productos", description: "Catalogo y stock", icon: RectangleStackIcon },
  { to: "/bitacora", label: "Bitacora", description: "Registro de actividades", icon: ClipboardDocumentListIcon },
];

export default function Sidebar({ open, onToggle }: SidebarProps) {
  return (
    <aside
      className={`${open ? "w-64" : "w-20"} min-h-screen flex-shrink-0 flex flex-col bg-primary-700 text-white shadow-lg transition-[width] duration-300 ease-smooth`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg font-bold text-white">PB</span>
            {open && (
              <div>
                <p className="text-sm font-semibold leading-tight">Prueba Admin</p>
                <p className="text-xs text-white/70">Panel de control</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Contraer barra lateral"
          >
            {open ? (
              <ChevronDoubleLeftIcon className="h-5 w-5" />
            ) : (
              <ChevronDoubleRightIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => {
                const base = "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-700";
                const layout = open ? "justify-start" : "justify-center";
                const state = isActive
                  ? "bg-white text-primary-700 shadow-soft"
                  : "text-white/80 hover:bg-white/10 hover:text-white";
                return [base, layout, state].join(" ");
              }}
            >
              {({ isActive }) => {
                const iconBase = "h-5 w-5 transition";
                const iconState = isActive
                  ? "text-primary-700"
                  : "text-white/80 group-hover:text-white";
                return (
                  <>
                    <item.icon className={`${iconBase} ${iconState}`} />
                    {open ? (
                      <div className="flex flex-col">
                        <span>{item.label}</span>
                        <span className="text-xs font-normal text-white/60">{item.description}</span>
                      </div>
                    ) : (
                      <span className="sr-only">{item.label}</span>
                    )}
                  </>
                );
              }}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/10 px-4 py-4 text-xs text-white/60">
          <p className="font-semibold text-white">Inventario 1.0</p>
          <p>Actualizado recientemente</p>
        </div>
      </div>
    </aside>
  );
}

