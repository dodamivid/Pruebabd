import { useEffect, useState } from "react";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  creado_en: string;
}

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📦 Lista de Productos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Precio</th>
              <th className="px-4 py-2 border">Stock</th>
              <th className="px-4 py-2 border">Creado en</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{p.id}</td>
                <td className="px-4 py-2 border">{p.nombre}</td>
                <td className="px-4 py-2 border text-green-600 font-semibold">
                  ${p.precio.toFixed(2)}
                </td>
                <td className="px-4 py-2 border">{p.stock}</td>
                <td className="px-4 py-2 border">
                  {new Date(p.creado_en).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
