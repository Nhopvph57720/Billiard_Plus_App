import api from "./api";
export async function listTables(params={}) {
  const { data } = await api.get("/tables", { params });
  return data;
}
export async function getTable(id) {
  const { data } = await api.get(`/tables/${id}`);
  return data;
}