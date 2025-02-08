import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaChevronDown } from 'react-icons/fa'; // Import the icon

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    gender: '', // Added gender field
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (!formData.username || !formData.email || !formData.password || !formData.gender) {
      setError('Please fill all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 201) {
        alert('User registered successfully!');
        navigate('/login');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Registration failed.');
      } else {
        setError('Server error. Please try again.');
      }
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
          backgroundImage: "url('https://example.com/romantic-night.jpg')", // Update with correct path
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
              opacity: 0.8,
            }}
            animate={{
              y: [0, -100],
              scale: [1, 0.5],
              opacity: [1, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          ></motion.div>
        ))}
      </div>

      {/* Register Form */}
      <div className="bg-gradient-to-r from-pink-100 to-pink-200 p-8 rounded-3xl shadow-lg w-full max-w-md z-10 border-4 border-pink-400 text-center">
        <h2 className="text-4xl font-extrabold mb-6 text-pink-700">Welcome to ConfessIt</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            className="w-full px-4 py-3 border border-pink-500 rounded-full text-lg"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            className="w-full px-4 py-3 border border-pink-500 rounded-full text-lg"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            className="w-full px-4 py-3 border border-pink-500 rounded-full text-lg"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Gender Selection */}
          <div className="relative">
            <select
              name="gender"
              className="w-full px-4 py-3 border border-pink-500 rounded-full text-lg bg-none appearance-none"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
            <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-pink-600 pointer-events-none" />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 rounded-full hover:bg-pink-700 transition duration-200 font-semibold text-lg"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;