import { AppError } from '../errors.js';
import type { CreateTaskInput, UpdateTaskInput } from '../types/task.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RUN_ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

function assertPlainObject(body: unknown): Record<string, unknown> {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError(400, 'Invalid request body');
  }
  return body as Record<string, unknown>;
}

function assertOnlyKeys(body: Record<string, unknown>, allowed: readonly string[]): void {
  const keys = Object.keys(body);
  for (const key of keys) {
    if (!allowed.includes(key)) {
      throw new AppError(400, `Unexpected field: ${key}`);
    }
  }
}

export function parseTitle(value: unknown): string {
  if (typeof value !== 'string') {
    throw new AppError(400, 'title must be a string');
  }
  const title = value.trim();
  if (title.length < 1 || title.length > 200) {
    throw new AppError(400, 'title must be 1..200 characters after trim');
  }
  return title;
}

export function parseRunId(value: unknown): string {
  if (typeof value !== 'string') {
    throw new AppError(400, 'runId must be a string');
  }
  if (!RUN_ID_RE.test(value)) {
    throw new AppError(400, 'runId must be 1..64 characters [A-Za-z0-9_-]');
  }
  return value;
}

export function parseDone(value: unknown): boolean {
  if (typeof value !== 'boolean') {
    throw new AppError(400, 'done must be a boolean');
  }
  return value;
}

export function parseTaskId(id: string): string {
  if (!UUID_RE.test(id)) {
    throw new AppError(400, 'Invalid task id');
  }
  return id;
}

export function parseCreateTaskBody(body: unknown): CreateTaskInput {
  const obj = assertPlainObject(body);
  assertOnlyKeys(obj, ['title', 'runId']);

  if (!('title' in obj) || !('runId' in obj)) {
    throw new AppError(400, 'title and runId are required');
  }

  return {
    title: parseTitle(obj.title),
    runId: parseRunId(obj.runId),
  };
}

export function parseUpdateTaskBody(body: unknown): UpdateTaskInput {
  const obj = assertPlainObject(body);
  assertOnlyKeys(obj, ['title', 'done']);

  const hasTitle = 'title' in obj;
  const hasDone = 'done' in obj;

  if (!hasTitle && !hasDone) {
    throw new AppError(400, 'At least one of title or done is required');
  }

  const result: UpdateTaskInput = {};
  if (hasTitle) {
    result.title = parseTitle(obj.title);
  }
  if (hasDone) {
    result.done = parseDone(obj.done);
  }
  return result;
}

export function parseRunIdQuery(value: unknown): string {
  if (value === undefined || value === null || value === '') {
    throw new AppError(400, 'runId query parameter is required');
  }
  if (Array.isArray(value)) {
    throw new AppError(400, 'runId must be a single value');
  }
  return parseRunId(value);
}
