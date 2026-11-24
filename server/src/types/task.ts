export type TaskDto = {
  id: string;
  ownerLogin: string;
  title: string;
  done: boolean;
  runId: string;
  createdAt: string;
};

export type CreateTaskInput = {
  title: string;
  runId: string;
};

export type UpdateTaskInput = {
  title?: string;
  done?: boolean;
};
