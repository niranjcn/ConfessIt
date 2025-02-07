// AnonymousConfession.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AnonymousConfession = () => {
  const [confession, setConfession] = useState(null);
  const confessions = [
    "I secretly enjoy eating ice cream for breakfast.",
    "I once ate an entire pizza by myself and didn't tell anyone.",
    "I still sleep with a stuffed animal sometimes.",
    "I accidentally sent a text to my boss that was meant for my friend.",
    "I once sang in the shower, and the neighbor knocked on the door to ask if I was okay.",
    "I have a secret talent for mimicking animal sounds.",
  ];

  const generateConfession = () => {
    const randomConfession = confessions[Math.floor(Math.random() * confessions.length)];
    setConfession(randomConfession);
  };

  

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-indigo-200 to-purple-400 p-6">
      <motion.h1 
        className="text-4xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>
        Anonymous Confessions 🤫
      </motion.h1>
      <button 
        onClick={generateConfession} 
        className="bg-white text-purple-600 px-6 py-3 rounded-full shadow-lg text-lg font-semibold hover:bg-purple-100 transition duration-200">
        Reveal a Confession
      </button>
      {confession && (
        <motion.p 
          className="text-2xl text-white mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}>
          🤭 {confession} 🤭
        </motion.p>
      )}
    </div>
  );
};

export default AnonymousConfession;