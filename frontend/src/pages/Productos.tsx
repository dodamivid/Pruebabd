import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Producto } from "../lib/types";

export default function Productos() {
  const [rows, setRows] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await api.get<Producto[]>("/productos");
        setRows(r.data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Error cargando productos";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-neutral-800">Productos</h1>

      {loading && <p className="text-neutral-500">Cargando…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <table className="min-w-full border border-neutral-200 shadow-sm rounded-lg">
          <thead className="bg-neutral-100 text-left">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Precio</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Creado en</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t hover:bg-neutral-50">
                <td className="p-2">{p.id}</td>
                <td className="p-2">{p.nombre}</td>
                <td className="p-2">${p.precio}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2">{new Date(p.creado_en).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
