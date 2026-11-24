import { api } from "../api";
import type { CreateTaskInput, Task, UpdateTaskInput } from "../types";

export async function createTask(input: CreateTaskInput): Promise<Task> {
  return api<Task>("/api/tasks/", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateTask(
  id: string,
  input: UpdateTaskInput,
): Promise<Task> {
  return api<Task>(`/api/tasks/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function listTasksByRunId(runId: string): Promise<Task[]> {
  return api<Task[]>(
    `/api/tasks/?runId=${encodeURIComponent(runId.trim())}`,
  );
}

export async function getTaskById(id: string): Promise<Task> {
  return api<Task>(`/api/tasks/${id.trim()}/`);
}

export async function deleteTask(id: string): Promise<void> {
  await api(`/api/tasks/${id}/`, { method: "DELETE" });
}
