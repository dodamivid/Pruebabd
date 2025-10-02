import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowPathIcon, PencilSquareIcon, PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { api, createProducto, deleteProducto, updateProducto } from "../lib/api";
import type { Producto } from "../lib/types";

type ProductoRow = Producto & {
  precio: number | string;
  stock: number | string;
};

type ModalMode = "create" | "edit" | null;

type FormState = {
  nombre: string;
  precio: string;
  stock: string;
};

const emptyForm: FormState = {
  nombre: "",
  precio: "",
  stock: "",
};

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
});

export default function Productos() {
  const [rows, setRows] = useState<ProductoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    void handleReload();
  }, []);

  const selectedProduct = useMemo(() => {
    const targetId = selectedId ?? deleteId;
    return targetId != null ? rows.find((row) => row.id === targetId) ?? null : null;
  }, [rows, selectedId, deleteId]);

  async function handleReload() {
    try {
      setLoading(true);
      const response = await api.get<ProductoRow[]>("/productos");
      setRows(response.data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error cargando productos";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setForm(emptyForm);
    setSelectedId(null);
    setDeleteId(null);
    setError(null);
    setModalMode("create");
  }

  function openEditModal(row: ProductoRow) {
    setSelectedId(row.id);
    setDeleteId(null);
    setError(null);
    setForm({
      nombre: row.nombre ?? "",
      precio: String(row.precio ?? ""),
      stock: String(row.stock ?? ""),
    });
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedId(null);
    setForm(emptyForm);
    setSubmitting(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const nombre = form.nombre.trim();
    const precio = Number(form.precio);
    const stock = Number(form.stock);

    if (!nombre) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (Number.isNaN(precio) || precio < 0) {
      setError("Ingresa un precio valido.");
      return;
    }
    if (Number.isNaN(stock) || stock < 0) {
      setError("Ingresa un stock valido.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      if (modalMode === "create") {
        await createProducto({ nombre, precio, stock });
      } else if (modalMode === "edit" && selectedId !== null) {
        await updateProducto(selectedId, { nombre, precio, stock });
      }
      await handleReload();
      closeModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo guardar el producto";
      setError(message);
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (deleteId === null) return;
    try {
      setSubmitting(true);
      await deleteProducto(deleteId);
      await handleReload();
      setDeleteId(null);
      setSelectedId(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo eliminar el producto";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Reporte</p>
          <h1 className="text-3xl font-bold text-neutral-900">Productos</h1>
          <p className="text-sm text-neutral-500">Consulta el catalogo y controla el stock disponible.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleReload}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 shadow-sm transition hover:border-primary-200 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
          >
            <PlusIcon className="h-4 w-4" />
            Nuevo producto
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-600">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card">
        <div className="border-b border-neutral-200 bg-neutral-50 px-5 py-3">
          <p className="text-sm font-semibold text-neutral-700">Listado de productos</p>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center px-6 py-16 text-neutral-400">
              <span className="flex items-center gap-3 text-sm font-medium">
                <ArrowPathIcon className="h-5 w-5 animate-spin" /> Cargando...
              </span>
            </div>
          ) : rows.length === 0 ? (
            <div className="px-6 py-12 text-sm text-neutral-500">Sin productos registrados.</div>
          ) : (
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Nombre</th>
                  <th className="px-5 py-3">Precio</th>
                  <th className="px-5 py-3">Stock</th>
                  <th className="px-5 py-3">Creado</th>
                  <th className="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-sm text-neutral-700">
                {rows.map((producto) => {
                  const precioNumber = Number(producto.precio);
                  const precioFormateado = Number.isFinite(precioNumber)
                    ? currencyFormatter.format(precioNumber)
                    : producto.precio;
                  return (
                    <tr key={producto.id} className="hover:bg-primary-50/40">
                      <td className="px-5 py-3 font-mono text-xs">#{producto.id}</td>
                      <td className="px-5 py-3 font-semibold">{producto.nombre}</td>
                      <td className="px-5 py-3">{precioFormateado}</td>
                      <td className="px-5 py-3">{producto.stock}</td>
                      <td className="px-5 py-3 text-xs text-neutral-500">
                        {new Date(producto.creado_en).toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(producto)}
                            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 transition hover:border-primary-200 hover:text-primary-600"
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteId(producto.id);
                              setSelectedId(producto.id);
                              setError(null);
                            }}
                            className="inline-flex items-center gap-2 rounded-lg border border-danger-200 bg-danger-50 px-3 py-1.5 text-xs font-semibold text-danger-600 transition hover:border-danger-300 hover:bg-danger-100"
                          >
                            <TrashIcon className="h-4 w-4" />
                            Borrar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-neutral-900">
                {modalMode === "create" ? "Nuevo producto" : "Editar producto"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Cerrar"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700" htmlFor="nombre">
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-800 shadow-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  placeholder="Producto"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700" htmlFor="precio">
                    Precio
                  </label>
                  <input
                    id="precio"
                    name="precio"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.precio}
                    onChange={(event) => setForm((prev) => ({ ...prev, precio: event.target.value }))}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-800 shadow-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700" htmlFor="stock">
                    Stock
                  </label>
                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-800 shadow-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Guardando..." : modalMode === "create" ? "Agregar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-neutral-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-neutral-900">Eliminar producto</h2>
            </div>
            <div className="space-y-4 px-6 py-5 text-sm text-neutral-600">
              <p>Seguro que deseas eliminar este producto?</p>
              {selectedProduct && selectedProduct.id === deleteId && (
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-700">
                  <p className="font-semibold">{selectedProduct.nombre}</p>
                  <p className="text-xs text-neutral-500">ID #{selectedProduct.id}</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-neutral-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-danger-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-danger-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
