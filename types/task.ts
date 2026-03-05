export const TASK_STATE_OPTIONS = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "CLOSED", label: "Closed" },
] as const;

export const TASK_PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
] as const;

export type State = (typeof TASK_STATE_OPTIONS)[number]["value"];
export type Priority = (typeof TASK_PRIORITY_OPTIONS)[number]["value"];

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
