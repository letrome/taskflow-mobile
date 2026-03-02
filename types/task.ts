type State = "OPEN" | "IN_PROGRESS" | "CLOSED";
type Priority = "LOW" | "MEDIUM" | "HIGH";

export type Task = {
  id: string;
  title: string;
  description: string;
  due_date?: string;
  priority: Priority;
  state: State;
  project: string;
  assignee?: string;
  tags: string[];
};
