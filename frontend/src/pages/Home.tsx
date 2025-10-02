import { Link } from "react-router-dom";
import {
  BoltIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

const quickLinks = [
  {
    to: "/productos",
    label: "Gestionar productos",
    description: "Agrega, edita y controla el stock con rapidez.",
    icon: Squares2X2Icon,
  },
  {
    to: "/bitacora",
    label: "Revisar bitacora",
    description: "Consulta los cambios recientes registrados por el sistema.",
    icon: ClipboardDocumentListIcon,
  },
];

const highlights = [
  { title: "Inventario confiable", description: "Controla el stock y visualiza tendencias en segundos.", icon: ShieldCheckIcon },
  { title: "Productividad", description: "Automatiza tareas repetitivas y reduce errores humanos.", icon: BoltIcon },
];

export default function Home() {
  return (
    <section className="space-y-10">
      <div className="overflow-hidden rounded-3xl bg-white shadow-card">
        <div className="relative grid gap-8 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 px-8 py-12 text-white md:grid-cols-[3fr,2fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">Panel principal</span>
            <h1 className="text-4xl font-bold md:text-5xl">Bienvenido de nuevo</h1>
            <p className="max-w-xl text-white/80">Gestiona productos, revisa la bitacora y mantente al dia con la actividad del sistema desde un mismo lugar.</p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/productos"
                className="btn btn-primary bg-white text-primary-700 hover:bg-primary-100"
              >
                Ir a productos
              </Link>
              <Link to="/bitacora" className="btn btn-ghost border-white/40 text-white hover:bg-white/10">
                Ver bitacora
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-2xl bg-white/10 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold">Destacados</h2>
            <ul className="mt-4 space-y-4">
              {highlights.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/90 text-primary-700">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div className="text-sm">
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-white/80">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl"
          >
            <div className="flex items-center gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600/10 text-primary-600 transition group-hover:bg-primary-600 group-hover:text-white">
                <link.icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-700">{link.label}</h3>
                <p className="text-sm text-neutral-500">{link.description}</p>
              </div>
            </div>
            <span className="mt-6 text-sm font-semibold text-primary-600 group-hover:text-primary-700">{'Acceder ->'}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

