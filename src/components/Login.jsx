import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) throw new Error(`Login failed: ${response.statusText}`);

      const data = await response.json();

      if (data.message === 'Login successful') {
        window.location.href = 'test.html';
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred while logging in.');
    }
  };

  const handleRegisterClick = () => {
    navigate('/register'); // Redirect to the register page
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={credentials.username}
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
              onClick={handleRegisterClick} // Handle click to navigate
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


