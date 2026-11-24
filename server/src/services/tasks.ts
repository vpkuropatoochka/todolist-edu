import { prisma } from '../db/client.js';
import { AppError } from '../errors.js';
import { toTaskDto } from '../mappers/task.js';
import { config } from '../config.js';
import type { CreateTaskInput, TaskDto, UpdateTaskInput } from '../types/task.js';

export async function createTask(input: CreateTaskInput): Promise<TaskDto> {
  const task = await prisma.task.create({
    data: {
      ownerLogin: config.userLogin,
      title: input.title,
      runId: input.runId,
      done: false,
      createdAt: new Date(),
    },
  });
  return toTaskDto(task);
}

export async function listTasksByRunId(runId: string): Promise<TaskDto[]> {
  const tasks = await prisma.task.findMany({
    where: {
      ownerLogin: config.userLogin,
      runId,
    },
    orderBy: { createdAt: 'asc' },
  });
  return tasks.map(toTaskDto);
}

export async function getTaskById(id: string): Promise<TaskDto> {
  const task = await prisma.task.findFirst({
    where: {
      id,
      ownerLogin: config.userLogin,
    },
  });
  if (!task) {
    throw new AppError(404, 'Task not found');
  }
  return toTaskDto(task);
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<TaskDto> {
  const [task] = await prisma.task.updateManyAndReturn({
    where: { id, ownerLogin: config.userLogin },
    data: input,
  });
  if (!task) {
    throw new AppError(404, 'Task not found');
  }
  return toTaskDto(task);
}

export async function deleteTask(id: string): Promise<void> {
  const existing = await prisma.task.findFirst({
    where: {
      id,
      ownerLogin: config.userLogin,
    },
  });
  if (!existing) {
    throw new AppError(404, 'Task not found');
  }

  await prisma.task.delete({ where: { id: existing.id } });
}
