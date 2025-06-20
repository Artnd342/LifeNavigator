import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  onSuccess: (token: string) => void;
}

const Login: React.FC<Props> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/login', { username, password });
      localStorage.setItem('token', res.data.token);
      onSuccess(res.data.token);
    } catch (err: any) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">Login</h2>
      <input type="text" placeholder="Username" className="border p-2 w-full" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" className="border p-2 w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
    </div>
  );
};

export default Login;