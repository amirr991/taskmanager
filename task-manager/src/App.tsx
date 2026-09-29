/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./tasksApi";
import type { Task, TaskStatus } from "./types";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("Новая");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [filter, setFilter] = useState("Все");

  async function loadTasks() {
    try {
      setLoading(true);

      const data = await getTasks();
      setTasks(data);
    } catch {
      setError("Не удалось загрузить задачи");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleSubmit() {
    if (!title.trim()) {
      return;
    }

    try {
      setError("");

      if (editingId === null) {
        const newTask = await createTask(
          title,
          description,
          status
        );

        setTasks([...tasks, newTask]);
      } else {
        const updatedTask = await updateTask(
          editingId,
          title,
          description,
          status
        );

        setTasks(
          tasks.map((task) =>
            task.id === editingId ? updatedTask : task
          )
        );

        setEditingId(null);
      }

      setTitle("");
      setDescription("");
      setStatus("Новая");
    } catch {
      setError("Ошибка при сохранении задачи");
    }
  }

  function handleEdit(task: Task) {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  }

  async function handleDelete(id: number) {
    try {
      setError("");

      await deleteTask(id);

      setTasks(tasks.filter((task) => task.id !== id));
    } catch {
      setError("Не удалось удалить задачу");
    }
  }

  const filteredTasks =
    filter === "Все"
      ? tasks
      : tasks.filter((task) => task.status === filter);

  return (
    <div>
      <h1>Менеджер задач</h1>

      <input
        type="text"
        placeholder="Название задачи"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />

      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />

      <select
        value={status}
        onChange={(e) =>
          setStatus(e.target.value as TaskStatus)
        }
      >
        <option value="Новая">Новая</option>
        <option value="В процессе">В процессе</option>
        <option value="Выполнена">Выполнена</option>
      </select>

      <br />

      <button onClick={handleSubmit}>
        {editingId === null
          ? "Добавить задачу"
          : "Сохранить изменения"}
      </button>

      <hr />

      <label>Фильтр: </label>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="Все">Все</option>
        <option value="Новая">Новая</option>
        <option value="В процессе">В процессе</option>
        <option value="Выполнена">Выполнена</option>
      </select>

      {loading && <p>Загрузка...</p>}

      {error && <p>{error}</p>}

      {filteredTasks.map((task) => (
        <div key={task.id}>
          <h2>{task.title}</h2>

          <p>{task.description}</p>

          <p>Статус: {task.status}</p>

          <button onClick={() => handleEdit(task)}>
            Редактировать
          </button>

          <button onClick={() => handleDelete(task.id)}>
            Удалить
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;