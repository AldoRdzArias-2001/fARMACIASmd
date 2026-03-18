import { useEffect, useState } from "react";
import * as BranchesApi from "../api/branches";

const emptyForm = {
  name: "",
  code: "",
  address: "",
  active: true,
};

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [err, setErr] = useState("");

  async function load() {
    try {
      const resp = await BranchesApi.listBranches();
      setBranches(resp.data);
    } catch (e) {
      setErr("Error cargando sucursales");
    }
  }

  useEffect(() => {
    load();
  }, []);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save(e) {
    e.preventDefault();
    setErr("");

    try {
      if (editingId) {
        await BranchesApi.updateBranch(editingId, form);
      } else {
        await BranchesApi.createBranch(form);
      }

      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Error guardando sucursal");
    }
  }

  function edit(branch) {
    setEditingId(branch.id);
    setForm({
      name: branch.name,
      code: branch.code,
      address: branch.address || "",
      active: branch.active,
    });
  }

  async function remove(id) {
    if (!confirm("¿Eliminar sucursal?")) return;

    try {
      await BranchesApi.deleteBranch(id);
      load();
    } catch {
      setErr("Error eliminando sucursal");
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Sucursales</h2>

      {err && <div style={{ color: "crimson", marginBottom: 12 }}>{err}</div>}

      <form onSubmit={save} style={{ display: "grid", gap: 10, maxWidth: 500, marginBottom: 20 }}>
        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
        />
        <input
          placeholder="Código"
          value={form.code}
          onChange={(e) => setField("code", e.target.value)}
        />
        <input
          placeholder="Dirección"
          value={form.address}
          onChange={(e) => setField("address", e.target.value)}
        />
        <select
          value={form.active ? "1" : "0"}
          onChange={(e) => setField("active", e.target.value === "1")}
        >
          <option value="1">Activa</option>
          <option value="0">Inactiva</option>
        </select>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">{editingId ? "Actualizar" : "Crear"}</button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #444" }}>
            <th>ID</th>
            <th>Nombre</th>
            <th>Código</th>
            <th>Dirección</th>
            <th>Activa</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {branches.map((branch) => (
            <tr key={branch.id} style={{ borderBottom: "1px solid #333" }}>
              <td>{branch.id}</td>
              <td>{branch.name}</td>
              <td>{branch.code}</td>
              <td>{branch.address}</td>
              <td>{branch.active ? "Sí" : "No"}</td>
              <td style={{ display: "flex", gap: 8 }}>
                <button onClick={() => edit(branch)}>Editar</button>
                <button onClick={() => remove(branch.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}