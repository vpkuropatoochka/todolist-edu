import { clearToken, setToken } from "../api";
import type { Author } from "../types";
import { getAuthor } from "./authorService";

export async function login(value: string): Promise<Author> {
  const token = value.trim();
  const author = await getAuthor(token);
  setToken(token);
  return author;
}

export function logout(): void {
  clearToken();
}
