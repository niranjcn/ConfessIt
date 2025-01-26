import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    semester: '',
    department: '',
    gmail: '',
    password: ''
  });

  const navigate = useNavigate(); // Initialize navigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if all fields are filled
    if (!formData.name || !formData.semester || !formData.department || !formData.gmail || !formData.password) {
      alert('Please fill all the fields.');
      return;
    }

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      alert(data.message);

      if (data.message === 'User registered successfully!') {
        localStorage.setItem('user', JSON.stringify(formData)); // Persist user data
        navigate('/login'); // Redirect to the login page
      }
    } catch (error) {
      console.error('Error registering user:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen relative overflow-hidden px-4" style={{ backgroundColor: '#fce4ec' }}>
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          backgroundImage: "url('/path/to/romantic-night.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)'
        }}
      />

      {/* Floating hearts animation */}
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

      <div className="bg-gradient-to-r from-pink-100 to-pink-200 p-8 rounded-3xl shadow-lg w-full max-w-md text-center z-10 border-4 border-pink-400">
        <h2 className="text-4xl font-extrabold mb-6 text-pink-700">Welcome to ConfessIt</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            className="w-full px-5 py-3 border-2 border-pink-500 rounded-full focus:outline-none focus:ring-4 focus:ring-pink-300 text-lg"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="semester"
            className="w-full px-5 py-3 border-2 border-pink-500 rounded-full focus:outline-none focus:ring-4 focus:ring-pink-300 text-lg"
            placeholder="Semester"
            value={formData.semester}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="department"
            className="w-full px-5 py-3 border-2 border-pink-500 rounded-full focus:outline-none focus:ring-4 focus:ring-pink-300 text-lg"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="gmail"
            className="w-full px-5 py-3 border-2 border-pink-500 rounded-full focus:outline-none focus:ring-4 focus:ring-pink-300 text-lg"
            placeholder="Gmail"
            value={formData.gmail}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            className="w-full px-5 py-3 border-2 border-pink-500 rounded-full focus:outline-none focus:ring-4 focus:ring-pink-300 text-lg"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
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




