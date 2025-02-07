import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RandomMatchmaking = () => {
  const [match, setMatch] = useState(null);
  const users = ["Alice", "Bob", "Charlie", "David", "Emma", "Frank", "Grace"];

  const findMatch = () => {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    setMatch(randomUser);
  };

  // Sidebar component
const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <motion.div 
      className={`fixed top-0 left-0 h-full bg-pink-600 shadow-lg p-5 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} 
      initial={{ x: -250 }} 
      animate={{ x: isOpen ? 0 : -250 }}>
      <button onClick={toggleSidebar} className="text-white mb-4">Close</button>
      <ul className="space-y-4 text-white">
        <li><Link to="/" className="hover:underline" onClick={toggleSidebar}>Homepage</Link></li>
        <li><Link to="/confessions" className="hover:underline" onClick={toggleSidebar}>Anonymous Confession</Link></li>
        <li><Link to="/matchmaking" className="hover:underline" onClick={toggleSidebar}>Random Matchmaking</Link></li>
      </ul>
    </motion.div>
  );
};

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-purple-200 to-pink-400 p-6">
      <motion.h1 
        className="text-4xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>
        Random Matchmaking 💕
      </motion.h1>
      <button 
        onClick={findMatch} 
        className="bg-white text-pink-600 px-6 py-3 rounded-full shadow-lg text-lg font-semibold hover:bg-pink-100 transition duration-200">
        Find Your Match
      </button>
      {match && (
        <motion.p 
          className="text-2xl text-white mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}>
          💖 You matched with {match}! 💖
        </motion.p>
      )}
    </div>
  );
};

export default RandomMatchmaking;
