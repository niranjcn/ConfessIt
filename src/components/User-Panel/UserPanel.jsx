import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import AnonymousConfession from "./AnonymousConfession";
import RandomMatchmaking from "./RandomMatchmaking";
import Female from "/src/assets/bitmoji/bitmofe.png";
import Male from "/src/assets/bitmoji/bitmomale.png";

const Sidebar = ({ isOpen, toggleSidebar, handleLogout, userData }) => {
  const navigate = useNavigate();

  const handleHomepageClick = () => {
    navigate('/userpanel'); // Navigate to the UserPanel route
    window.location.reload(); // Force a refresh
  };

  return (
    <motion.div
      className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-br from-pink-700 via-red-500 to-purple-800 shadow-2xl p-6 transition-transform border-r border-pink-300 flex flex-col ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      initial={{ x: -300 }}
      animate={{ x: isOpen ? 0 : -300 }}
    >
      {/* Close Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 text-gray-200 hover:text-white text-2xl"
      >
        ✕
      </button>

      {/* App Logo */}
      <div className="text-white text-3xl font-bold mb-6 text-center tracking-wide">
        ConfessIt 💘
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center text-white border-b border-gray-500 pb-6">
        <img
          src={userData?.gender === "Male" ? Male : Female}
          alt="Bitmoji"
          className="w-24 h-24 rounded-full mb-3 border-4 border-yellow-300 shadow-lg"
        />
        <p className="text-lg font-semibold">{userData?.username}</p>
        <p className="text-sm text-gray-300">{userData?.email}</p>
      </div>

      {/* Navigation Links */}
      <ul className="mt-12 text-white text-lg space-y-5 flex-grow">
        <li>
        <button
            onClick={() => navigate("/userpanel")}
            className={`block px-4 py-3 rounded-lg w-full text-left font-semibold transition ${
              location.pathname === "/userpanel"
                ? "bg-pink-600 text-white shadow-lg scale-105"
                : "hover:bg-pink-500"
            }`}
          >
            🏠 Homepage
          </button>
        </li>
        <li>
          <Link
            to="/confessions"
            className="block px-4 py-3 rounded-lg hover:bg-pink-500 transition font-semibold"
            onClick={toggleSidebar}
          >
            💬 Anonymous Confession
          </Link>
        </li>
        <li>
          <Link
            to="/matchmaking"
            className="block px-4 py-3 rounded-lg hover:bg-pink-500 transition font-semibold"
            onClick={toggleSidebar}
          >
            ❤️ Random Matchmaking
          </Link>
        </li>
      </ul>

      {/* Logout Button */}
      <div className="pb-6">
        <button
          onClick={() => {
            handleLogout();
            navigate("/login");
          }}
          className="w-full p-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
        >
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
    <div className="flex h-screen bg-gradient-to-br from-pink-600 via-red-500 to-purple-700 text-white">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        userData={userData}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all p-8 ${
          isSidebarOpen ? "ml-72" : "ml-0"
        } flex flex-col items-center justify-center`}
      >
        {/* Floating Menu Button */}
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="fixed top-4 left-4 text-white text-2xl bg-gray-800 p-2 rounded-lg shadow-lg hover:bg-gray-700 transition"
          >
            ☰
          </button>
        )}

        {/* Welcome Message */}
        <h1 className="text-4xl font-bold text-center">
          Try your luck with love,{" "}
          <span className="text-yellow-300">{userData?.username} 💘</span>
        </h1>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-8 mt-10 w-full max-w-4xl">
          {[
            { title: "Profile", emoji: "💖", desc: "View & edit your profile." },
            { title: "Anonymous Confession", emoji: "💌", desc: "Express your feelings anonymously." },
            { title: "Random Matchmaking", emoji: "💞", desc: "Find a potential match!" },
            { title: "Coming Soon", emoji: "💕", desc: "Exciting features ahead!" },
          ].map((item, index) => (
            <div
              key={index}
              className="p-10 rounded-xl shadow-xl bg-pink-700/40 border border-pink-300 text-center flex flex-col items-center justify-center h-56 hover:scale-105 transition-transform duration-300 relative"
            >
              <span className="text-5xl">{item.emoji}</span>
              <h2 className="text-2xl font-bold mt-4">{item.title}</h2>
              <p className="text-lg text-gray-200 mt-2">{item.desc}</p>
              {/* Glowing Cupid Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/30 to-purple-500/30 blur-xl opacity-60"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default UserPanel;
