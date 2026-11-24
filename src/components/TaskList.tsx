import type { Task } from "../types";
import { TrashIcon } from "./TrashIcon";

type TaskListProps = {
  tasks: Task[];
  busy: boolean;
  onDoneChange: (id: string, done: boolean) => void;
  emptyText?: string;
  onDelete: (id: string) => void;
};

export function TaskList({
  tasks,
  busy,
  emptyText = "Заданий пока нет",
  onDoneChange,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="task-list-empty muted">{emptyText}</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className="task-item">
          <input
            type="checkbox"
            className="task-item__done"
            aria-label={`Отметка о выполнении задания «${task.title}»`}
            checked={task.done}
            disabled={busy}
            onChange={(event) => onDoneChange(task.id, event.currentTarget.checked)}
          />
          <div className="task-item__body">
            <strong>{task.title}</strong>
            <span className="muted">
              {task.id}
              {task.runId ? ` · ${task.runId}` : ""}
              {task.done ? " · выполнено" : ""}
            </span>
          </div>
          <button
            type="button"
            className="btn-danger-icon"
            aria-label={`Удалить задание ${task.title}`}
            disabled={busy}
            onClick={() => onDelete(task.id)}
          >
            <TrashIcon />
          </button>
        </li>
      ))}
    </ul>
  );
}
