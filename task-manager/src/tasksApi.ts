import type { Task, TaskStatus } from "./types";

const API_URL = "http://localhost:3000/tasks";

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Ошибка при получении задач");
  }

  return response.json();
}

export async function createTask(
  title: string,
  description: string,
  status: TaskStatus
): Promise<Task> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
      status,
    }),
  });

  if (!response.ok) {
    throw new Error("Ошибка при создании задачи");
  }

  return response.json();
}

export async function updateTask(
  id: number,
  title: string,
  description: string,
  status: TaskStatus
): Promise<Task> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
      status,
    }),
  });

  if (!response.ok) {
    throw new Error("Ошибка при изменении задачи");
  }

  return response.json();
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Ошибка при удалении задачи");
  }
}