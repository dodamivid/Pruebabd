import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  CalendarIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { getBitacora, getReporteProductosRango } from "../lib/api";
import type { LogRow, Producto } from "../lib/types";

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
});

const csvContentType = "text/csv;charset=utf-8;";

export default function Bitacora() {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [reportRows, setReportRows] = useState<Producto[] | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [range, setRange] = useState({ ini: "", fin: "" });

  useEffect(() => {
    void reloadBitacora();
  }, []);

  const normalized = useMemo(() => {
    return rows.map((row) => ({
      ...row,
      realizado_en_fmt: dateFormatter.format(new Date(row.realizado_en)),
    }));
  }, [rows]);

  async function reloadBitacora() {
    try {
      setLoading(true);
      const data = await getBitacora();
      setRows(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error cargando bitacora";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!range.ini || !range.fin) {
      setReportError("Selecciona fecha inicio y fin");
      return;
    }
    try {
      setReportLoading(true);
      setReportError(null);
      const data = await getReporteProductosRango(range);
      setReportRows(data);
      setFilterOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo obtener el reporte";
      setReportError(message);
    } finally {
      setReportLoading(false);
    }
  }

  function handleDownloadCsv() {
    if (!reportRows || reportRows.length === 0) return;
    const headers = ["id", "nombre", "precio", "stock", "creado_en"] as const;
    const escape = (value: unknown) => {
      const s = value == null ? "" : String(value);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [
      headers.join(","),
      ...reportRows.map((row) => headers.map((header) => escape(row[header])).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: csvContentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reporte-productos-${range.ini}_a_${range.fin}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Auditoria</p>
          <h1 className="text-3xl font-bold text-neutral-900">Bitacora</h1>
          <p className="text-sm text-neutral-500">Consulta la actividad mas reciente registrada por el sistema.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-600 shadow-sm transition hover:border-primary-200 hover:text-primary-600"
          >
            <FunnelIcon className="h-4 w-4" />
            Reporte por rango
          </button>
          <button
            type="button"
            onClick={reloadBitacora}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 shadow-sm transition hover:border-primary-200 hover:text-primary-700 disabled:opacity-60"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-600">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-5 py-3">
          <p className="text-sm font-semibold text-neutral-700">Registros recientes</p>
          {reportRows && reportRows.length > 0 && (
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 transition hover:border-primary-200 hover:text-primary-600"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Exportar ultimo reporte
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center px-6 py-16 text-neutral-400">
              <span className="flex items-center gap-3 text-sm font-medium">
                <ArrowPathIcon className="h-5 w-5 animate-spin" /> Cargando...
              </span>
            </div>
          ) : normalized.length === 0 ? (
            <div className="px-6 py-12 text-sm text-neutral-500">Sin eventos registrados.</div>
          ) : (
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Tabla</th>
                  <th className="px-5 py-3">Accion</th>
                  <th className="px-5 py-3">Detalle</th>
                  <th className="px-5 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-sm text-neutral-700">
                {normalized.map((row) => (
                  <tr key={row.id} className="hover:bg-primary-50/40">
                    <td className="px-5 py-3 font-mono text-xs">#{row.id}</td>
                    <td className="px-5 py-3">{row.tabla}</td>
                    <td className="px-5 py-3 font-semibold">{row.accion}</td>
                    <td className="px-5 py-3 text-xs text-neutral-600 whitespace-pre-wrap">
                      {row.detalle ? JSON.stringify(row.detalle, null, 2) : "Sin detalle"}
                    </td>
                    <td className="px-5 py-3 text-xs text-neutral-500">{row.realizado_en_fmt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {filterOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-neutral-900">Reporte por rango</h2>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="rounded-full p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Cerrar"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleReport} className="space-y-5 px-6 py-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700" htmlFor="ini">
                  Fecha inicio
                </label>
                <div className="relative">
                  <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <input
                    id="ini"
                    name="ini"
                    type="date"
                    value={range.ini}
                    onChange={(event) => setRange((prev) => ({ ...prev, ini: event.target.value }))}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-10 py-2 text-sm text-neutral-800 shadow-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700" htmlFor="fin">
                  Fecha fin
                </label>
                <div className="relative">
                  <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <input
                    id="fin"
                    name="fin"
                    type="date"
                    value={range.fin}
                    onChange={(event) => setRange((prev) => ({ ...prev, fin: event.target.value }))}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-10 py-2 text-sm text-neutral-800 shadow-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    required
                  />
                </div>
              </div>
              {reportError && (
                <div className="rounded-lg border border-danger-200 bg-danger-50 px-4 py-2 text-sm text-danger-600">
                  {reportError}
                </div>
              )}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={reportLoading}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {reportLoading ? "Consultando..." : "Generar reporte"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {reportRows && reportRows.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-primary-200 bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-primary-200 bg-primary-50 px-5 py-3">
            <div>
              <p className="text-sm font-semibold text-primary-700">Reporte de productos</p>
              <p className="text-xs text-primary-600">
                Del {range.ini || "-"} al {range.fin || "-"} · {reportRows.length} registros
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReportRows(null)}
              className="rounded-full p-1 text-primary-500 transition hover:bg-primary-100 hover:text-primary-700"
              aria-label="Cerrar reporte"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-primary-200">
              <thead className="bg-primary-100 text-left text-xs font-semibold uppercase tracking-wide text-primary-700">
                <tr>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Nombre</th>
                  <th className="px-5 py-3">Precio</th>
                  <th className="px-5 py-3">Stock</th>
                  <th className="px-5 py-3">Fecha creado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100 text-sm text-neutral-700">
                {reportRows.map((row) => (
                  <tr key={`${row.id}-${row.creado_en}`} className="hover:bg-primary-50">
                    <td className="px-5 py-3 font-mono text-xs">#{row.id}</td>
                    <td className="px-5 py-3 font-semibold">{row.nombre}</td>
                    <td className="px-5 py-3">{row.precio}</td>
                    <td className="px-5 py-3">{row.stock}</td>
                    <td className="px-5 py-3 text-xs text-neutral-500">
                      {row.creado_en ? new Date(row.creado_en).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}



