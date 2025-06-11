import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Task = {
  id: number;
  title: string;
  estimated_time: number;
  completed: boolean;
};


const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/errands');
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tasks.');
      setLoading(false);
    }
  };

  const toggleComplete = async (id: number) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      await axios.put(`/api/errands/${id}`, {
        completed: !task.completed,
      });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (err) {
      console.error('Failed to toggle task status.');
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`/api/errands/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Failed to delete task.');
    }
  };

  if (loading) return <p className="text-gray-600">Loading tasks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks found.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between p-4 rounded-lg shadow bg-white hover:bg-gray-50 transition"
            >
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                  className="w-5 h-5 text-blue-500"
                />
                <div>
                  <p
                    className={`text-lg ${
                      task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Estimated: {task.estimated_time} min
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;


