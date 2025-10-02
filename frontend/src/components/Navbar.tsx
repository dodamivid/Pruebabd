type NavbarProps = {
  onToggleSidebar: () => void;
};

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  return (
    <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
      <button
        onClick={onToggleSidebar}
        className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
      >
        ☰
      </button>
      <h1 className="text-xl font-bold text-neutral-800">Panel Admin</h1>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-neutral-600">Usuario</span>
        <img
          src="https://ui-avatars.com/api/?name=Admin&background=6d28d9&color=fff"
          alt="user"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </header>
  );
}
