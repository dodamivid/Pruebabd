import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { pool } from './db';

const app = express();
app.use(cors());
app.use(express.json());

// --- PRUEBA DE CONEXIÓN ---
app.get('/api/ping', async (_req: Request, res: Response) => {
  const [rows] = await pool.query('SELECT 1+1 AS resultado');
  res.json(rows);
});

// --- LISTAR PRODUCTOS DE LA TABLA ---
app.get('/api/productos', async (_req: Request, res: Response) => {
  const [rows] = await pool.query('SELECT id, nombre, precio, stock, creado_en FROM productos ORDER BY id DESC');
  res.json(rows);
});

app.listen(Number(process.env.PORT), () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});
// ================== CRUD PRODUCTOS ==================

// CREATE (dispara trigger INSERT)
app.post('/api/productos', async (req: Request, res: Response) => {
  try {
    const { nombre, precio, stock } = req.body;
    if (!nombre || precio == null || stock == null) {
      return res.status(400).json({ error: 'Faltan campos: nombre, precio, stock' });
    }
    const [r] = await pool.execute(
      'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
      [nombre, precio, stock]
    );
    const id = (r as any).insertId;
    res.status(201).json({ id, nombre, precio, stock });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE (dispara trigger UPDATE)
app.put('/api/productos/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, precio, stock } = req.body;
    const [r] = await pool.execute(
      'UPDATE productos SET nombre=?, precio=?, stock=? WHERE id=?',
      [nombre, precio, stock, id]
    );
    res.json({ ok: true, affectedRows: (r as any).affectedRows });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE (dispara trigger DELETE)
app.delete('/api/productos/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [r] = await pool.execute('DELETE FROM productos WHERE id=?', [id]);
    res.json({ ok: true, affectedRows: (r as any).affectedRows });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ================== BITÁCORA Y SP ==================

// Ver bitácora (para comprobar triggers)
app.get('/api/bitacora', async (_req: Request, res: Response) => {
  const [rows] = await pool.query('SELECT * FROM bitacora ORDER BY id DESC');
  res.json(rows);
});

// Llamar el SP de reporte por rango (ya creado en tu BD)
app.get('/api/reporte', async (req: Request, res: Response) => {
  const { ini, fin } = req.query as { ini?: string; fin?: string };
  if (!ini || !fin) return res.status(400).json({ error: 'Usa ?ini=YYYY-MM-DD&fin=YYYY-MM-DD' });
  const [rows] = await pool.query('CALL sp_reporte_productos_rango(?, ?)', [ini, fin]);
  res.json((rows as any)[0]);
});
// GET bitácora
app.get('/api/bitacora', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bitacora ORDER BY realizado_en DESC');
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});
type DetalleInsertDelete = { nombre: string; precio: number; stock: number };
type DetalleUpdate = { antes: DetalleInsertDelete; despues: DetalleInsertDelete };

function parseDetalle(detalle: string): DetalleInsertDelete | DetalleUpdate | null {
  try { return JSON.parse(detalle); } catch { return null; }
}

/** Reporte limpio: normaliza columnas según acción */
app.get('/api/bitacora/reporte', async (_req, res) => {
  try {
    const [rows] = await pool.query<any[]>(
      'SELECT id, tabla, accion, id_registro, detalle, realizado_en FROM bitacora ORDER BY realizado_en DESC'
    );

    const bonito = rows.map(r => {
      const det = parseDetalle(r.detalle ?? '');
      if (r.accion === 'UPDATE' && det && 'antes' in det && 'despues' in det) {
        const d = det as DetalleUpdate;
        return {
          id: r.id,
          tabla: r.tabla,
          accion: r.accion,
          id_registro: r.id_registro,
          antes_nombre: d.antes?.nombre,
          antes_precio: d.antes?.precio,
          antes_stock: d.antes?.stock,
          despues_nombre: d.despues?.nombre,
          despues_precio: d.despues?.precio,
          despues_stock: d.despues?.stock,
          realizado_en: r.realizado_en
        };
      } else if (det && 'nombre' in det) {
        const d = det as DetalleInsertDelete;
        return {
          id: r.id,
          tabla: r.tabla,
          accion: r.accion,
          id_registro: r.id_registro,
          nombre: d.nombre,
          precio: d.precio,
          stock: d.stock,
          realizado_en: r.realizado_en
        };
      } else {
        // Fallback si el JSON viene roto
        return { ...r };
      }
    });

    res.json(bonito);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});
function toCSV(rows: any[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v: any) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [
    headers.join(','),
    ...rows.map(r => headers.map(h => escape((r as any)[h])).join(','))
  ];
  return lines.join('\n');
}

app.get('/api/bitacora.csv', async (_req, res) => {
  try {
    const url = new URL('http://x'); // dummy para reusar la normalización
    const fakeReq: any = { query: url.searchParams }; // no usamos query aquí
    const [rows] = await pool.query<any[]>(
      'SELECT id, tabla, accion, id_registro, detalle, realizado_en FROM bitacora ORDER BY realizado_en DESC'
    );

    // Reutilizamos la misma normalización que arriba (copypaste rápido):
    const normalizado = rows.map(r => {
      const det = parseDetalle(r.detalle ?? '');
      if (r.accion === 'UPDATE' && det && 'antes' in det && 'despues' in det) {
        const d = det as DetalleUpdate;
        return {
          id: r.id,
          tabla: r.tabla,
          accion: r.accion,
          id_registro: r.id_registro,
          antes_nombre: d.antes?.nombre,
          antes_precio: d.antes?.precio,
          antes_stock: d.antes?.stock,
          despues_nombre: d.despues?.nombre,
          despues_precio: d.despues?.precio,
          despues_stock: d.despues?.stock,
          realizado_en: r.realizado_en
        };
      } else if (det && 'nombre' in det) {
        const d = det as DetalleInsertDelete;
        return {
          id: r.id,
          tabla: r.tabla,
          accion: r.accion,
          id_registro: r.id_registro,
          nombre: d.nombre,
          precio: d.precio,
          stock: d.stock,
          realizado_en: r.realizado_en
        };
      } else {
        return { ...r };
      }
    });

    const csv = toCSV(normalizado);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="bitacora.csv"');
    res.send(csv);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});
