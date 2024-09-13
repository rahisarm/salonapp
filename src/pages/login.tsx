// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@shadcn/ui-button'; // Example component imports, adjust as needed

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Implement login logic here
    if (email && password) {
      // Redirect to dashboard upon successful login
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-8 rounded-md shadow-lg bg-white">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-2"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
        </div>
        <Button onClick={handleLogin} className="w-full mt-4">
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
