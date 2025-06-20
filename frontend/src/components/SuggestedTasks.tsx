import React, { useState } from 'react';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
  estimated_time: number;
}

interface Props {
  token: string;
}

const SuggestedTasks: React.FC<Props> = ({ token }) => {
  const [suggestions, setSuggestions] = useState<Task[]>([]);

  const fetchSuggestions = async () => {
    const res = await axios.post('http://localhost:5000/api/ai/suggest', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSuggestions(res.data.suggestions);
  };

  return (
    <div className="space-y-2">
      <button onClick={fetchSuggestions} className="bg-indigo-600 text-white px-4 py-2 rounded">Get Suggestions</button>
      <ul className="list-disc pl-6">
        {suggestions.map(task => (
          <li key={task.id}>{task.title} - {task.estimated_time} mins</li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestedTasks;

