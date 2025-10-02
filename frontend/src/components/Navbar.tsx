import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type NavbarProps = {
  onToggleSidebar: () => void;
};

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white/80 px-5 py-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-200"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-400">Panel central</p>
          <h1 className="text-lg font-semibold text-neutral-900">Inventario y reportes</h1>
        </div>
      </div>

      <div className="hidden flex-1 items-center gap-4 pl-8 md:flex">
        <div className="relative w-full max-w-md">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            placeholder="Buscar en el panel"
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-10 pr-3 text-sm text-neutral-700 shadow-sm placeholder:text-neutral-400 focus:border-primary-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-200"
          aria-label="Notificaciones"
        >
          <BellIcon className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-semibold text-white">3</span>
        </button>
        <div className="flex items-center gap-3 rounded-full bg-neutral-100 px-3 py-1.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
            AD
          </div>
          <div className="hidden leading-tight md:block">
            <p className="text-sm font-semibold text-neutral-800">Administrador</p>
            <p className="text-xs text-neutral-500">admin@demo.dev</p>
          </div>
        </div>
      </div>
    </header>
  );
}

