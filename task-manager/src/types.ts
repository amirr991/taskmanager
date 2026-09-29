export type TaskStatus = "Новая" | "В процессе" | "Выполнена";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
}