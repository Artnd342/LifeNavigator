import React, { useState } from 'react';

interface AddTaskProps {
  onAdd: (title: string, estimated_time: number) => void;
}

const AddTask: React.FC<AddTaskProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(title, parseInt(estimatedTime));
    setTitle('');
    setEstimatedTime('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="border p-2 rounded w-full"
      />
      <input
        type="number"
        value={estimatedTime}
        onChange={(e) => setEstimatedTime(e.target.value)}
        placeholder="Estimated time (min)"
        className="border p-2 rounded w-full"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
        Add Task
      </button>
    </form>
  );
};

export default AddTask;
