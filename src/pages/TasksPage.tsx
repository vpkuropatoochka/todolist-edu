import { useEffect, useState, type FormEvent } from "react";
import { Field } from "../components/Field";
import { TaskList } from "../components/TaskList";
import "../components/TaskList.css";
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
  const [createRunId, setCreateRunId] = useState("");

  const [updateId, setUpdateId] = useState("");
  const [updateTitle, setUpdateTitle] = useState("");

  const [listRunId, setListRunId] = useState(DEFAULT_RUN_ID);
  const [taskId, setTaskId] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

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
    if (busy) return;

    setBusy(true);
    setActionError("");
    try {
      const created = await tasksService.createTask({
        title: createTitle,
        runId: createRunId.trim(),
      });

      setCreateTitle("");
      setCreateRunId("");
      setListRunId(created.runId);
      setTaskId("");
      setTasks([created]);

      try {
        setTasks(await tasksService.listTasksByRunId(created.runId));
      } catch (err) {
        setActionError(`Задание создано. Не удалось обновить список: ${getErrorMessage(err)}`);
      }
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function saveTask(id: string, input: UpdateTaskInput) {
    if (busy) return false;

    setBusy(true);
    setActionError("");
    try {
      const updated = await tasksService.updateTask(id, input);
      setTasks((current) => current.map((task) => (task.id === updated.id ? updated : task)));
      return true;
    } catch (err) {
      setActionError(getErrorMessage(err));
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = updateId.trim();
    const title = updateTitle.trim();
    if (id && title && (await saveTask(id, { title }))) {
      setUpdateId("");
      setUpdateTitle("");
    }
  }

  async function handleListByRunId(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setActionError("");
    try {
      const runId = listRunId.trim();
      const data = await tasksService.listTasksByRunId(runId);
      setTasks(data);
      setListRunId(runId);
      setTaskId("");
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleGetById(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setActionError("");
    try {
      const task = await tasksService.getTaskById(taskId);
      setTasks([task]);
      setTaskId("");
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (busy) return;

    setBusy(true);
    setActionError("");
    try {
      await tasksService.deleteTask(id);
      setTasks((current) => current.filter((task) => task.id !== id));
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="app-shell tasks-page">
      <header className="tasks-header">
        <div>
          <p className="brand tasks-header__brand">TodoList</p>
          <h1>Рабочая панель</h1>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onLogout}
        >
          Выйти
        </button>
      </header>

      <section className="section-block user-card">
        <h2>Пользователь</h2>
        <div className="user-card__meta">
          <strong>{author.fullName}</strong>
          <span className="muted">@{author.login}</span>
        </div>
      </section>

      <div className="pair-grid">
        <section className="section-block">
          <h2>Создать задание</h2>
          <form onSubmit={handleCreate}>
            <div className="form-row two-cols">
              <Field
                id="create-title"
                label="title"
                value={createTitle}
                onChange={setCreateTitle}
                placeholder="Купить молоко"
              />
              <Field
                id="create-run-id"
                label="runId"
                value={createRunId}
                onChange={setCreateRunId}
                placeholder="sprint-12"
              />
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={busy || !createTitle.trim() || !createRunId.trim()}
              >
                Создать
              </button>
            </div>
          </form>
        </section>

        <section className="section-block">
          <h2>Обновить задание</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-row">
              <Field
                id="update-id"
                label="id"
                value={updateId}
                onChange={setUpdateId}
                placeholder="uuid задания"
              />
            </div>
            <div className="form-row">
              <Field
                id="update-title"
                label="title"
                value={updateTitle}
                onChange={setUpdateTitle}
                placeholder="Новый заголовок"
              />
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={busy || !updateId.trim() || !updateTitle.trim()}
              >
                Обновить
              </button>
            </div>
          </form>
        </section>
      </div>

      <div className="pair-grid">
        <section className="section-block">
          <h2>Получить все задания по runId</h2>
          <form onSubmit={handleListByRunId}>
            <div className="form-row">
              <Field
                id="list-run-id"
                label="runId"
                value={listRunId}
                onChange={setListRunId}
                placeholder="sprint-12"
              />
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={busy || !listRunId.trim()}
              >
                Получить
              </button>
            </div>
          </form>
        </section>

        <section className="section-block">
          <h2>Получить по id</h2>
          <form onSubmit={handleGetById}>
            <div className="form-row">
              <Field
                id="get-task-id"
                label="id"
                value={taskId}
                onChange={setTaskId}
                placeholder="uuid задания"
              />
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={busy || !taskId.trim()}
              >
                Получить
              </button>
            </div>
          </form>
        </section>
      </div>

      <section className="section-block results-block">
        <h2>Результат</h2>
        <TaskList
          tasks={tasks}
          busy={busy}
          emptyText={busy ? "Загрузка…" : undefined}
          onDoneChange={(id, done) => void saveTask(id, { done })}
          onDelete={(id) => void handleDelete(id)}
        />
        {actionError ? <p className="error-text">{actionError}</p> : null}
      </section>
    </main>
  );
}
