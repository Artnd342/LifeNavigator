import React, { useEffect, useState } from 'react';

type Task = {
  id: number;
  title: string;
  estimated_time: number;
  completed: boolean;
};

const SuggestedTasks: React.FC = () => {
  const [suggestedTasks, setSuggestedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch('/api/ai/suggest');
        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }
        const data = await response.json();
        setSuggestedTasks(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  if (loading) return <p className="text-gray-600">Loading suggestions...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">AI Suggested Tasks (Shortest First)</h2>
      {suggestedTasks.length === 0 ? (
        <p className="text-gray-500">No suggestions available.</p>
      ) : (
        <ul className="space-y-3">
          {suggestedTasks.map((task) => (
            <li
              key={task.id}
              className="p-4 bg-white rounded-xl shadow-md flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-medium">{task.title}</p>
                <p className="text-sm text-gray-500">Estimated Time: {task.estimated_time} mins</p>
              </div>
              {task.completed ? (
                <span className="text-green-500 font-bold">✓ Done</span>
              ) : (
                <span className="text-yellow-600 font-semibold">Pending</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SuggestedTasks;
