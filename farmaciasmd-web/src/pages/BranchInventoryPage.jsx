import { useEffect, useState } from "react";
import * as BranchesApi from "../api/branches";
import * as ProductsApi from "../api/products";
import * as InventoryApi from "../api/inventory";

export default function BranchInventoryPage() {
  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [movements, setMovements] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    branch_id: "",
    product_id: "",
    type: "entry",
    quantity: 1,
    notes: "",
  });

  async function loadInitial() {
    try {
      const branchesResp = await BranchesApi.listBranches();
      const productsResp = await ProductsApi.listProducts();

      setBranches(branchesResp.data);
      setProducts(productsResp.data.data || []);
    } catch {
      setErr("Error cargando datos iniciales");
    }
  }

  async function loadStocksAndMovements(branchId = "") {
    try {
      const stocksResp = await InventoryApi.listBranchStocks(branchId);
      const movementsResp = await InventoryApi.listStockMovements(branchId);

      setStocks(stocksResp.data);
      setMovements(movementsResp.data);
    } catch {
      setErr("Error cargando inventario");
    }
  }

  useEffect(() => {
    loadInitial();
    loadStocksAndMovements();
  }, []);

  useEffect(() => {
    loadStocksAndMovements(selectedBranch);
  }, [selectedBranch]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submitMovement(e) {
    e.preventDefault();
    setErr("");

    try {
      await InventoryApi.createStockMovement({
        ...form,
        branch_id: Number(form.branch_id),
        product_id: Number(form.product_id),
        quantity: Number(form.quantity),
      });

      setForm({
        branch_id: "",
        product_id: "",
        type: "entry",
        quantity: 1,
        notes: "",
      });

      loadStocksAndMovements(selectedBranch);
    } catch (e) {
      setErr(e?.response?.data?.message || "Error registrando movimiento");
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Inventario por sucursal</h2>

      {err && <div style={{ color: "crimson", marginBottom: 12 }}>{err}</div>}

      <div style={{ marginBottom: 20 }}>
        <label>Filtrar por sucursal: </label>
        <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
          <option value="">Todas</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      <h3>Registrar movimiento</h3>

      <form onSubmit={submitMovement} style={{ display: "grid", gap: 10, maxWidth: 500, marginBottom: 24 }}>
        <select value={form.branch_id} onChange={(e) => setField("branch_id", e.target.value)}>
          <option value="">Selecciona sucursal</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select value={form.product_id} onChange={(e) => setField("product_id", e.target.value)}>
          <option value="">Selecciona producto</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select value={form.type} onChange={(e) => setField("type", e.target.value)}>
          <option value="entry">Entrada</option>
          <option value="exit">Salida</option>
          <option value="adjustment">Ajuste</option>
        </select>

        <input
          type="number"
          min="1"
          value={form.quantity}
          onChange={(e) => setField("quantity", e.target.value)}
          placeholder="Cantidad"
        />

        <textarea
          placeholder="Notas"
          value={form.notes}
          onChange={(e) => setField("notes", e.target.value)}
        />

        <button type="submit">Guardar movimiento</button>
      </form>

      <h3>Existencias</h3>
      <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse", marginBottom: 24 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #444" }}>
            <th>Sucursal</th>
            <th>Producto</th>
            <th>Stock actual</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #333" }}>
              <td>{item.branch?.name}</td>
              <td>{item.product?.name}</td>
              <td>{item.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Movimientos</h3>
      <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #444" }}>
            <th>ID</th>
            <th>Sucursal</th>
            <th>Producto</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Notas</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((m) => (
            <tr key={m.id} style={{ borderBottom: "1px solid #333" }}>
              <td>{m.id}</td>
              <td>{m.branch?.name}</td>
              <td>{m.product?.name}</td>
              <td>{m.type}</td>
              <td>{m.quantity}</td>
              <td>{m.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}