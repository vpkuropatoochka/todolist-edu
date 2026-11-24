import { Router } from 'express';
import * as tasksService from '../services/tasks.js';
import {
  parseCreateTaskBody,
  parseRunIdQuery,
  parseTaskId,
  parseUpdateTaskBody,
} from '../validation/tasks.js';

export const tasksRouter = Router();

tasksRouter.post('/', async (req, res) => {
  const input = parseCreateTaskBody(req.body);
  const task = await tasksService.createTask(input);
  res.status(201).json(task);
});

tasksRouter.get('/', async (req, res) => {
  const runId = parseRunIdQuery(req.query.runId);
  const tasks = await tasksService.listTasksByRunId(runId);
  res.json(tasks);
});

tasksRouter.get('/:id/', async (req, res) => {
  const id = parseTaskId(req.params.id);
  const task = await tasksService.getTaskById(id);
  res.json(task);
});

tasksRouter.patch('/:id/', async (req, res) => {
  const id = parseTaskId(req.params.id);
  const input = parseUpdateTaskBody(req.body);
  const task = await tasksService.updateTask(id, input);
  res.json(task);
});

tasksRouter.delete('/:id/', async (req, res) => {
  const id = parseTaskId(req.params.id);
  await tasksService.deleteTask(id);
  res.status(204).send();
});
