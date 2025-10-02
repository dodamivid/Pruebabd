import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { LogRow } from "../lib/types";

export default function Bitacora() {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await api.get<LogRow[]>("/bitacora/reporte");
        setRows(r.data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Error cargando bitácora";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-neutral-800">Bitácora</h1>

      {loading && <p className="text-neutral-500">Cargando…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <table className="min-w-full border border-neutral-200 shadow-sm rounded-lg">
          <thead className="bg-neutral-100 text-left">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Tabla</th>
              <th className="p-2">Acción</th>
              <th className="p-2">Detalle</th>
              <th className="p-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t hover:bg-neutral-50">
                <td className="p-2">{r.id}</td>
                <td className="p-2">{r.tabla}</td>
                <td className="p-2">{r.accion}</td>
                <td className="p-2 text-xs whitespace-pre-wrap">
                  {JSON.stringify(r.detalle, null, 2)}
                </td>
                <td className="p-2">
                  {new Date(r.realizado_en).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
