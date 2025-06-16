import React, { useState, useEffect } from "react";

const TodoApp = () => {
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("todo_tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState("all"); // all, active, completed
  const [sortAsc, setSortAsc] = useState(true); // toggle sorting

  useEffect(() => {
    localStorage.setItem("todo_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!taskInput.trim()) return alert("Task cannot be empty!");

    const newTask = {
      id: Date.now(),
      text: taskInput.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks([newTask, ...tasks]);
    setTaskInput("");
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) =>
    sortAsc
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow mt-10 bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">React To-Do List</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          className="flex-grow p-2 border rounded"
          placeholder="Enter a new task"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <div className="flex justify-between mb-4 text-sm">
        <div>
          <button onClick={() => setFilter("all")} className="mr-2">
            All
          </button>
          <button onClick={() => setFilter("active")} className="mr-2">
            Active
          </button>
          <button onClick={() => setFilter("completed")}>Completed</button>
        </div>
        <button onClick={() => setSortAsc(!sortAsc)}>
          Sort: {sortAsc ? "Oldest" : "Newest"}
        </button>
      </div>

      <ul>
        {sortedTasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between p-2 border-b"
          >
            <div
              onClick={() => toggleComplete(task.id)}
              className={`cursor-pointer flex-grow ${
                task.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {task.text}
            </div>
            <button
              onClick={() => removeTask(task.id)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </li>
        ))}
        {sortedTasks.length === 0 && (
          <li className="text-center text-gray-400 mt-4">No tasks found</li>
        )}
      </ul>
    </div>
  );
};

export default TodoApp;
