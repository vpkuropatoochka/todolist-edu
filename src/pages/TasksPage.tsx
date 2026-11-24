import { useEffect, useState, type FormEvent } from "react";
import { Field } from "../components/Field";
import { TaskList } from "../components/TaskList";
import * as tasksService from "../services/tasksService";
import type { Author, Task, UpdateTaskInput } from "../types";
import { getErrorMessage } from "../utils/errors";
import "./TasksPage.css";

const DEFAULT_RUN_ID = "manual";

type TasksPageProps = {
  author: Author;
  onLogout: () => void;
};

export function TasksPage({ author, onLogout }: TasksPageProps) {
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(true);
  const [createTitle, setCreateTitle] = useState("");
  const [createRunId, setCreateRunId] = useState(DEFAULT_RUN_ID);
  const [listRunId, setListRunId] = useState(DEFAULT_RUN_ID);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pendingTaskIds, setPendingTaskIds] = useState(() => new Set<string>());
  const formBusy = busy || pendingTaskIds.size > 0;

  useEffect(() => {
    let active = true;

    async function loadInitialTasks() {
      try {
        const data = await tasksService.listTasksByRunId(DEFAULT_RUN_ID);
        if (active) setTasks(data);
      } catch (err) {
        if (active) setActionError(getErrorMessage(err));
      } finally {
        if (active) setBusy(false);
      }
    }

    void loadInitialTasks();
    return () => {
      active = false;
    };
  }, []);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = createTitle.trim();
    const runId = createRunId.trim();
    if (formBusy || !title || !runId) return;

    setBusy(true);
    setActionError("");
    try {
      const created = await tasksService.createTask({ title, runId });
      setCreateTitle("");
      setCreateRunId(created.runId);
      setListRunId(created.runId);
      setTasks([created]);

      try {
        setTasks(await tasksService.listTasksByRunId(created.runId));
      } catch (err) {
        setActionError(`Дело добавлено. Не удалось обновить список: ${getErrorMessage(err)}`);
      }
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function withTaskPending(id: string, action: () => Promise<void>) {
    if (busy || pendingTaskIds.has(id)) return false;

    setPendingTaskIds((current) => new Set(current).add(id));
    setActionError("");
    try {
      await action();
      return true;
    } catch (err) {
      setActionError(getErrorMessage(err));
      return false;
    } finally {
      setPendingTaskIds((current) => {
        const remaining = new Set(current);
        remaining.delete(id);
        return remaining;
      });
    }
  }

  function saveTask(id: string, input: UpdateTaskInput) {
    return withTaskPending(id, async () => {
      const updated = await tasksService.updateTask(id, input);
      setTasks((current) => current.map((task) => (task.id === updated.id ? updated : task)));
    });
  }

  async function handleListByRunId(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const runId = listRunId.trim();
    if (formBusy || !runId) return;

    setBusy(true);
    setActionError("");
    try {
      setTasks(await tasksService.listTasksByRunId(runId));
      setListRunId(runId);
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function handleDelete(id: string) {
    return withTaskPending(id, async () => {
      await tasksService.deleteTask(id);
      setTasks((current) => current.filter((task) => task.id !== id));
    });
  }

  return (
    <main className="app-shell tasks-page">
      <header className="tasks-header">
        <div>
          <h1>Список дел</h1>
          <p className="tasks-author">
            <span>{author.fullName}</span>
            <span className="muted">@{author.login}</span>
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onLogout}>
          Выйти
        </button>
      </header>

      <section className="panel" aria-labelledby="add-task-heading">
        <h2 id="add-task-heading">Новое дело</h2>
        <form className="task-create" onSubmit={handleCreate}>
          <Field
            id="create-title"
            label="Название"
            value={createTitle}
            onChange={setCreateTitle}
            maxLength={200}
            disabled={busy}
          />
          <Field
            id="create-run-id"
            label="runId"
            value={createRunId}
            onChange={setCreateRunId}
            maxLength={64}
            disabled={busy}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={formBusy || !createTitle.trim() || !createRunId.trim()}
          >
            Добавить
          </button>
        </form>
      </section>

      {actionError ? (
        <p className="error-text" role="alert">
          {actionError}
        </p>
      ) : null}

      <section className="panel task-panel" aria-labelledby="task-list-heading">
        <div className="task-panel__header">
          <h2 id="task-list-heading">Дела</h2>
          <form className="task-filter" onSubmit={handleListByRunId}>
            <Field
              id="list-run-id"
              label="Фильтр по runId"
              value={listRunId}
              onChange={setListRunId}
              maxLength={64}
              disabled={busy}
            />
            <button
              type="submit"
              className="btn btn-ghost"
              disabled={formBusy || !listRunId.trim()}
            >
              Показать
            </button>
          </form>
        </div>

        <TaskList
          tasks={tasks}
          busy={busy}
          pendingTaskIds={pendingTaskIds}
          onRename={(id, title) => saveTask(id, { title })}
          onDoneChange={(id, done) => void saveTask(id, { done })}
          onDelete={(id) => void handleDelete(id)}
        />
      </section>
    </main>
  );
}
