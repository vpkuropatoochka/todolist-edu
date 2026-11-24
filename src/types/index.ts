export type Author = {
  login: string;
  fullName: string;
};

export type Task = {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
  runId: string;
  ownerLogin?: string;
};

export type CreateTaskInput = {
  title: string;
  runId: string;
};

export type UpdateTaskInput = {
  title?: string;
  done?: boolean;
};
