import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  token: string;
  onAdd: () => void;
}

const AddTask: React.FC<Props> = ({ token, onAdd }) => {
  const [title, setTitle] = useState('');
  const [estimated, setEstimated] = useState(0);

  const handleAdd = async () => {
    await axios.post('http://localhost:5000/api/tasks', {
      title,
      estimated_time: estimated
    }, { headers: { Authorization: `Bearer ${token}` } });

    setTitle('');
    setEstimated(0);
    onAdd();
  };

  return (
    <div className="space-y-2">
      <input placeholder="Task title" className="border p-2 w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="number" placeholder="Estimated time" className="border p-2 w-full" value={estimated} onChange={(e) => setEstimated(Number(e.target.value))} />
      <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={handleAdd}>Add Task</button>
    </div>
  );
};

export default AddTask;