type SidebarProps = {
  open: boolean;
  onToggle: () => void;
};

export default function Sidebar({ open, onToggle }: SidebarProps) {
  return (
    <aside
      className={`${
        open ? "w-64" : "w-16"
      } bg-purple-700 text-white min-h-screen transition-all duration-300`}
    >
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-bold">{open ? "Menú" : "M"}</h2>
        <button
          onClick={onToggle}
          className="bg-purple-500 hover:bg-purple-600 px-2 py-1 rounded"
        >
          {open ? "<" : ">"}
        </button>
      </div>
      <nav className="mt-4 flex flex-col space-y-2 px-2">
        <a href="/home" className="hover:bg-purple-600 p-2 rounded">
          Home
        </a>
        <a href="/productos" className="hover:bg-purple-600 p-2 rounded">
          Productos
        </a>
        <a href="/bitacora" className="hover:bg-purple-600 p-2 rounded">
          Bitácora
        </a>
      </nav>
    </aside>
  );
}
