import axios from "axios";
import type { Producto, LogRow } from "./types";

type ApiConfig = {
  baseURL: string;
};

const config: ApiConfig = {
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
};

export const api = axios.create({
  baseURL: config.baseURL,
  headers: { "Content-Type": "application/json" },
});

// ---------- Productos ----------
export async function getProductos(): Promise<Producto[]> {
  const { data } = await api.get<Producto[]>("/productos");
  return data;
}

export async function createProducto(
  p: Omit<Producto, "id" | "creado_en">
): Promise<unknown> {
  const { data } = await api.post("/productos", p);
  return data;
}

export async function updateProducto(
  id: number,
  p: Partial<Omit<Producto, "id" | "creado_en">>
): Promise<unknown> {
  const { data } = await api.put(`/productos/${id}`, p);
  return data;
}

export async function deleteProducto(id: number): Promise<unknown> {
  const { data } = await api.delete(`/productos/${id}`);
  return data;
}

// ---------- Bitacora ----------
export async function getBitacora(): Promise<LogRow[]> {
  const { data } = await api.get<LogRow[]>("/bitacora/reporte");
  return data;
}

export async function getReporteProductosRango(params: {
  ini: string;
  fin: string;
}): Promise<Producto[]> {
  const { data } = await api.get<Producto[]>("/reporte", { params });
  return data;
}
