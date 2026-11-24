import type { Task } from '@prisma/client';
import type { TaskDto } from '../types/task.js';

export function toTaskDto(task: Task): TaskDto {
  const createdAt = task.createdAt ?? new Date(0);

  return {
    id: task.id,
    ownerLogin: task.ownerLogin,
    title: task.title,
    done: task.done,
    runId: task.runId,
    createdAt: createdAt.toISOString(),
  };
}
