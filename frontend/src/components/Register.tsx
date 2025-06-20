import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  onSuccess: () => void;
}

const Register: React.FC<Props> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/register', { username, password });
      alert(res.data.message);
      onSuccess();
    } catch (err: any) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">Register</h2>
      <input type="text" placeholder="Username" className="border p-2 w-full" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" className="border p-2 w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister} className="bg-green-600 text-white px-4 py-2 rounded">Register</button>
    </div>
  );
};

export default Register;


