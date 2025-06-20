import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar } from 'react-calendar';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';


const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogin = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Dashboard token={token} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

// 🔐 Login Component
const Login: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/login`, { username, password });
      onLogin(res.data.token);
    } catch {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

// 📝 Register Component
const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/register`, { username, password });
      alert('Registered! Now login');
    } catch {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
};

// ✅ Full Dashboard Inline
const Dashboard: React.FC<{ token: string; onLogout: () => void }> = ({ token, onLogout }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [repeatEvery, setRepeatEvery] = useState('');

  const fetchTasks = async () => {
    const res = await axios.get(`${API}/api/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  };

  useEffect(() => {
    if ('Notification' in window) Notification.requestPermission();
    fetchTasks();
  }, []);

  const handleAdd = async () => {
    try {
      await axios.post(
        `${API}/api/tasks`,
        {
          title,
          estimated_time: parseInt(estimatedTime),
          repeatEvery: repeatEvery ? parseInt(repeatEvery) : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setEstimatedTime('');
      setRepeatEvery('');
      fetchTasks();
      if (Notification.permission === 'granted') {
        new Notification('New Task Added', {
          body: title,
        });
      }
    } catch {
      alert('Error adding task');
    }
  };

  const onDragEnd = (result: DropResult) => {
  const { destination, source } = result;
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setTasks(items);
  };

  const chartData = tasks.map(task => ({
    name: task.title,
    time: task.estimated_time,
  }));

  return (
    <div>
      <h2>📋 Dashboard</h2>
      <button onClick={onLogout}>Logout</button>

      <input
        placeholder="Task Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        placeholder="Estimated Time"
        type="number"
        value={estimatedTime}
        onChange={e => setEstimatedTime(e.target.value)}
      />
      <input
        placeholder="Repeat Every (days)"
        type="number"
        value={repeatEvery}
        onChange={e => setRepeatEvery(e.target.value)}
      />
      <button onClick={handleAdd}>Add Task</button>

      <h3>Your Tasks</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {provided => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((task, index) => (
                <Draggable
                  key={task.id}
                  draggableId={task.id.toString()}
                  index={index}
                >
                  {provided => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {task.title} - {task.estimated_time} min
                      {task.repeatEvery && ` 🔁 every ${task.repeatEvery}d`}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      <h3>📅 Calendar</h3>
      <Calendar />

      <h3>📊 Progress</h3>
      <BarChart width={500} height={300} data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="time" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default App;





