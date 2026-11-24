import { useRef, useState, type FormEvent } from "react";
import type { Task } from "../types";
import { TrashIcon } from "./TrashIcon";
import "./TaskList.css";

type TaskActions = {
  busy: boolean;
  onDoneChange: (id: string, done: boolean) => void;
  onRename: (id: string, title: string) => Promise<boolean>;
  onDelete: (id: string) => void;
};

type TaskListProps = TaskActions & { tasks: Task[]; pendingTaskIds: ReadonlySet<string> };
type TaskRowProps = TaskActions & { task: Task };

function TaskRow({ task, busy, onDoneChange, onRename, onDelete }: TaskRowProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const renameButton = useRef<HTMLButtonElement>(null);
  const titleToSave = draft?.trim() ?? "";

  function closeEditor() {
    setDraft(null);
    requestAnimationFrame(() => renameButton.current?.focus());
  }

  async function handleRename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !titleToSave || titleToSave === task.title) return;
    if (await onRename(task.id, titleToSave)) closeEditor();
  }

  return (
    <li className="task-item">
      <input
        type="checkbox"
        className="task-item__done"
        aria-label={`Выполнено: ${task.title}`}
        checked={task.done}
        disabled={busy}
        onChange={(event) => onDoneChange(task.id, event.currentTarget.checked)}
      />

      {draft === null ? (
        <>
          <span
            className={task.done ? "task-item__title task-item__title--done" : "task-item__title"}
          >
            {task.title}
          </span>
          <div className="task-item__actions">
            <button
              ref={renameButton}
              type="button"
              className="btn btn-ghost btn-small"
              aria-label={`Переименовать «${task.title}»`}
              disabled={busy}
              onClick={() => setDraft(task.title)}
            >
              Переименовать
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-small btn-icon"
              aria-label={`Удалить «${task.title}»`}
              title="Удалить"
              disabled={busy}
              onClick={() => onDelete(task.id)}
            >
              <TrashIcon />
            </button>
          </div>
        </>
      ) : (
        <form
          className="task-item__edit"
          onSubmit={handleRename}
          onKeyDown={(event) => {
            if (event.key === "Escape" && !busy) closeEditor();
          }}
        >
          <input
            type="text"
            className="text-input"
            aria-label="Новое название"
            value={draft}
            maxLength={200}
            autoFocus
            disabled={busy}
            onChange={(event) => setDraft(event.currentTarget.value)}
          />
          <div className="task-item__actions">
            <button
              type="submit"
              className="btn btn-primary btn-small"
              disabled={busy || !titleToSave || titleToSave === task.title}
            >
              Сохранить
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-small"
              disabled={busy}
              onClick={closeEditor}
            >
              Отмена
            </button>
          </div>
        </form>
      )}
    </li>
  );
}

export function TaskList({ tasks, pendingTaskIds, ...actions }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="task-list-empty muted" role="status">
        {actions.busy ? "Загрузка…" : "Пока нет дел."}
      </p>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          {...actions}
          busy={actions.busy || pendingTaskIds.has(task.id)}
        />
      ))}
    </ul>
  );
}
