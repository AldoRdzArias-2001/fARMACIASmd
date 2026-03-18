import { api } from "./client";

export async function listBranches() {
  const res = await api.get("/branches");
  return res.data;
}

export async function createBranch(payload) {
  const res = await api.post("/branches", payload);
  return res.data;
}

export async function updateBranch(id, payload) {
  const res = await api.put(`/branches/${id}`, payload);
  return res.data;
}

export async function deleteBranch(id) {
  const res = await api.delete(`/branches/${id}`);
  return res.data;
}