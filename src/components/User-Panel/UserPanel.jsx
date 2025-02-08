import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnonymousConfession from './AnonymousConfession'; // Import the AnonymousConfession component
import RandomMatchmaking from './RandomMatchmaking'; // Import the RandomMatchmaking component

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


// Homepage component
const Homepage = ({ toggleSidebar }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-200 to-pink-400 p-6">
      <button onClick={toggleSidebar} className="absolute top-4 left-4 text-white bg-pink-700 p-2 rounded">☰</button>
      <motion.h1 
        className="text-5xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>
        Welcome to Love Haven ❤️
      </motion.h1>
      <p className="text-white text-lg text-center">Find love, share confessions, and discover random matches!</p>
    </div>
  );
};


// UserPanel component
const UserPanel = () => {
  const [userData, setUserData] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    // Fetch user data based on the token in localStorage
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        return; // If no token, don't fetch data (or redirect to login)
      }

      try {
        const response = await fetch('http://localhost:5000/userpanel', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUserData(data);
          console.log("Rendering UserPanel"); // Successfully fetched user data
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      {/* Sidebar and Homepage */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Homepage toggleSidebar={toggleSidebar} />
      
      {/* User Data Section */}
      <div className="user-panel mt-6 p-6">
        {userData ? (
          <div>
            <h1 className="text-3xl font-bold">Welcome, {userData.username}</h1>
            <p className="mt-2">Email: {userData.email}</p>
            {/* Add more user-specific info here */}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default UserPanel;
// App component
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/userpanel" element={<UserPanel />} />
        <Route path="/confessions" element={<AnonymousConfession />} /> {/* Route to AnonymousConfession */}
        <Route path="/matchmaking" element={<RandomMatchmaking />} /> {/* Route to RandomMatchmaking */}
      </Routes>
    </Router>
  );
};

