import { api } from "./client";

export async function listBranchStocks(branchId = "") {
  const res = await api.get("/branch-stocks", {
    params: branchId ? { branch_id: branchId } : {},
  });
  return res.data;
}

export async function listStockMovements(branchId = "", productId = "") {
  const params = {};
  if (branchId) params.branch_id = branchId;
  if (productId) params.product_id = productId;

  const res = await api.get("/stock-movements", { params });
  return res.data;
}

export async function createStockMovement(payload) {
  const res = await api.post("/stock-movements", payload);
  return res.data;
}