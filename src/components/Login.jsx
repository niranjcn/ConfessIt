import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/login', credentials, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.status === 200) {
        const { token, role } = response.data;
  
        // Store the token and role in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('role', role);
  
        // Navigate to /userpanel after successful login
        navigate('/userpanel');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid email or password.');
    }
  };
  
  return (
    <div className="flex justify-center items-center h-screen relative overflow-hidden px-4 bg-gradient-to-r from-pink-100 to-pink-200">
      {/* Background Image and Overlay */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          backgroundImage: "url('http://127.0.0.1:5500/Web%20dev%20begin/images/6057485.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.6)',
        }}
      />

      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8 bg-pink-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.8
            }}
            animate={{
              y: [0, -100],
              scale: [1, 0.5],
              opacity: [1, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          ></motion.div>
        ))}
      </div>

      {/* Login Form */}
      <div className="bg-gradient-to-r from-pink-100 to-pink-200 p-8 rounded-3xl shadow-lg w-full max-w-md z-10 border-4 border-pink-400 text-center">
        <h2 className="text-4xl font-extrabold mb-6 text-pink-700">Login to ConfessIt</h2>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border-2 border-pink-500 rounded-full focus:outline-none focus:ring-4 focus:ring-pink-300 text-lg"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border-2 border-pink-500 rounded-full focus:outline-none focus:ring-4 focus:ring-pink-300 text-lg"
          />
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 rounded-full hover:bg-pink-700 transition duration-200 font-semibold text-lg"
          >
            Login
          </button>
          <p className="text-center text-pink-700">
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              className="underline cursor-pointer hover:text-pink-600"
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
