import { FaHome } from "react-icons/fa";

export default function Home() {
  return (
    <section className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="max-w-3xl mx-auto text-center px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 text-primary-700 shadow-soft mb-5">
          <FaHome className="w-8 h-8" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold">
          Bienvenido al <span className="text-primary-700">Panel</span>
        </h1>

        <p className="text-neutral-600 mt-3">
          Gestiona productos y revisa la bitácora del sistema con una interfaz limpia y consistente.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <a href="/productos" className="btn btn-primary">Ir a Productos</a>
          <a href="/bitacora" className="btn btn-ghost">Ver Bitácora</a>
        </div>
      </div>
    </section>
  );
}
