// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Bitacora from "./pages/Bitacora";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/bitacora" element={<Bitacora />} />
        <Route path="*" element={<div className="p-6">404 Not Found</div>} />
      </Routes>
    </Layout>
  );
}
