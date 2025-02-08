import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import AnonymousConfession from './AnonymousConfession';
import RandomMatchmaking from './RandomMatchmaking';

const Sidebar = ({ isOpen, toggleSidebar, handleLogout }) => {
  const navigate = useNavigate();

  const handleHomepageClick = () => {
    navigate('/userpanel'); // Navigate to the UserPanel route
    window.location.reload(); // Force a refresh
  };

  return (
    <motion.div 
      className={`fixed top-0 left-0 h-full bg-gray-900 shadow-xl p-6 transition-transform w-72 border-r border-gray-700 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} 
      initial={{ x: -300 }} 
      animate={{ x: isOpen ? 0 : -300 }}>
      
      <button onClick={toggleSidebar} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">✕</button>
      <div className="text-white text-3xl font-bold mb-4 text-center tracking-wide">Love Haven</div>
      
      <div className="flex flex-col items-center text-white mt-4 border-b border-gray-700 pb-6">
        <div className="w-20 h-20 rounded-full bg-gray-700 mb-3"></div>
        <p className="text-lg font-semibold">John Doe</p>
        <p className="text-sm text-gray-400">johndoe@example.com</p>
        <p className="text-sm text-gray-500 mt-1">Reg No: 123456789</p>
      </div>

      <ul className="mt-20 text-white text-lg space-y-5 flex-grow">
        <li>
          <button 
            onClick={handleHomepageClick} 
            className="block px-4 py-2 rounded hover:bg-gray-700 transition w-full text-left">
            🏠 Homepage
          </button>
        </li>
        <li>
          <Link to="/confessions" className="block px-4 py-2 rounded hover:bg-gray-700 transition" onClick={toggleSidebar}>
            💬 Anonymous Confession
          </Link>
        </li>
        <li>
          <Link to="/matchmaking" className="block px-4 py-2 rounded hover:bg-gray-700 transition" onClick={toggleSidebar}>
            ❤️ Random Matchmaking
          </Link>
        </li>
      </ul>

      <div className="pb-6">
        <button 
          onClick={() => {
            handleLogout();
            navigate('/login');
          }}
          className="w-full p-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">
          Logout
        </button>
      </div>
    </motion.div>
  );
};

const UserPanel = () => {
  const [userData, setUserData] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No token found');
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/userpanel', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setUserData(data);
        } else {
          console.error('Error fetching user data:', data.error);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white relative">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} userData={userData} handleLogout={handleLogout} />
      
      <div className={`flex-1 transition-all p-6 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="flex justify-between items-center relative">
          {!isSidebarOpen && (
            <button onClick={toggleSidebar} className="absolute top-4 left-4 text-white text-2xl">☰</button>
          )}
          <h1 className="text-3xl font-bold ml-12 mt-6">Try your luck with love, {userData?.username}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-10 h-screen relative z-10">
          {['Profile', 'Anonymous Confession', 'Random Matchmaking', 'Coming Soon'].map((title, index) => (
            <div key={index} className="p-12 bg-gray-800 rounded-lg hover:bg-gray-700 transition-transform transform hover:scale-105 shadow-xl h-96 flex flex-col justify-center items-center relative">
              <h2 className="text-4xl font-bold">{title}</h2>
              <p className="text-gray-400 mt-2 text-xl">{title === 'Coming Soon' ? 'Stay tuned for new features.' : `Explore the ${title.toLowerCase()}.`}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserPanel />} />
        <Route path="/confessions" element={<AnonymousConfession />} />
        <Route path="/matchmaking" element={<RandomMatchmaking />} />
      </Routes>
    </Router>
  );
};

export default UserPanel;
