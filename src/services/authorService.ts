import { api } from "../api";
import type { Author } from "../types";

export async function getAuthor(token?: string): Promise<Author> {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  return api<Author>("/api/author/", { headers });
}
