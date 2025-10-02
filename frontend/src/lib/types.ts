// Tipos compartidos por el front

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  creado_en: string; // ISO
};

// Estructuras que puede traer "detalle" en bitácora
export type BitacoraDetalleInsert = {
  nombre: string;
  precio: number;
  stock: number;
};

export type BitacoraDetalleUpdate = {
  antes: BitacoraDetalleInsert;
  despues: BitacoraDetalleInsert;
};

export type BitacoraDetalle = BitacoraDetalleInsert | BitacoraDetalleUpdate;

// Fila de bitácora (el backend la llama "bitacora")
export type LogRow = {
  id: number;
  tabla: string;
  accion: "INSERT" | "UPDATE" | "DELETE";
  id_registro: number;
  detalle: BitacoraDetalle | null; // si prefieres: unknown
  realizado_en: string; // ISO
};
