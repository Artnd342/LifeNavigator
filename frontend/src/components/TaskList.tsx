import React from 'react';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
  estimated_time: number;
  completed: boolean;
}

interface Props {
  tasks: Task[];
  token: string;
  refresh: () => void;
}

const TaskList: React.FC<Props> = ({ tasks, token, refresh }) => {
  const toggle = async (task: Task) => {
    await axios.put(`http://localhost:5000/api/tasks/${task.id}`, {
      ...task,
      completed: !task.completed
    }, { headers: { Authorization: `Bearer ${token}` } });
    refresh();
  };

  const remove = async (id: number) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    refresh();
  };

  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <div key={task.id} className="border p-2 flex justify-between">
          <span className={`${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title} - {task.estimated_time} mins</span>
          <div className="flex gap-2">
            <button onClick={() => toggle(task)} className="text-green-600">✅</button>
            <button onClick={() => remove(task.id)} className="text-red-600">🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;


