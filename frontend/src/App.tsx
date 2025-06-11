import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

type Task = {
  id: number;
  title: string;
  estimated_time: number;
  completed: boolean;
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen p-6 bg-gray-50 text-gray-900">
        <header className="mb-6">
          <nav className="space-x-6 text-lg font-medium">
            <Link to="/" className="text-blue-600 hover:underline">Home</Link>
            <Link to="/tasks" className="text-blue-600 hover:underline">Tasks</Link>
            <Link to="/ai-suggest" className="text-blue-600 hover:underline">AI Suggestions</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/ai-suggest" element={<AISuggestions />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

// ✅ Home page inline
const Home = () => (
  <div className="mt-8">
    <h1 className="text-2xl font-bold">Welcome to LifeNavigator</h1>
    <p className="mt-2 text-gray-600">Your intelligent task and life organizer.</p>
  </div>
);

// ✅ Tasks page inline (Placeholder for now)
const Tasks = () => (
  <div className="mt-8">
    <h1 className="text-2xl font-bold">Tasks</h1>
    <p className="mt-2 text-gray-600">This is where your task list will go.</p>
  </div>
);

// ✅ AI Suggestions page inline
const AISuggestions = () => {
  const [suggestedTasks, setSuggestedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch('/api/ai/suggest');
        const data = await response.json();
        setSuggestedTasks(data);
      } catch (error) {
        console.error('Error fetching AI suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">AI-Suggested Task Order</h2>
      {loading ? (
        <p className="text-gray-500">Loading suggestions...</p>
      ) : suggestedTasks.length === 0 ? (
        <p className="text-gray-500">No suggestions available.</p>
      ) : (
        <ul className="space-y-2">
          {suggestedTasks.map((task) => (
            <li
              key={task.id}
              className="p-4 bg-white shadow rounded-md border border-gray-200"
            >
              <div className="font-semibold">{task.title}</div>
              <div className="text-sm text-gray-500">Estimated Time: {task.estimated_time} mins</div>
              <div className="text-sm text-gray-500">Status: {task.completed ? 'Completed' : 'Pending'}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;



