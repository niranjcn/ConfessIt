import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Female from "/src/assets/bitmoji/bitmofe.png";
import Male from "/src/assets/bitmoji/bitmomale.png";

const Sidebar = ({ isOpen, toggleSidebar, handleLogout, userData }) => {
  const navigate = useNavigate();

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
              window.location.pathname === "/userpanel"
                ? "bg-pink-600 text-white shadow-lg scale-105"
                : "hover:bg-pink-500"
            }`}
          >
            🏠 Homepage
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/confessions")}
            className={`block px-4 py-3 rounded-lg w-full text-left font-semibold transition ${
              window.location.pathname === "/confessions"
                ? "bg-pink-600 text-white shadow-lg scale-105"
                : "hover:bg-pink-500"
            }`}
          >
            💬 Anonymous Confession
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/matchmaking")}
            className={`block px-4 py-3 rounded-lg w-full text-left font-semibold transition ${
              window.location.pathname === "/matchmaking"
                ? "bg-pink-600 text-white shadow-lg scale-105"
                : "hover:bg-pink-500"
            }`}
          >
            ❤️ Random Matchmaking
          </button>
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
  const [confessions, setConfessions] = useState([]);
  const [topConfessions, setTopConfessions] = useState([]);
  const [newConfession, setNewConfession] = useState("");
  const [recipient, setRecipient] = useState("");
  const [showForm, setShowForm] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found");
        return;
      }
      try {
        const response = await fetch("http://localhost:5000/userpanel", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setUserData(data);
        } else {
          console.error("Error fetching user data:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchConfessions = async () => {
      const response = await fetch("http://localhost:5000/confessions");
      const data = await response.json();
      setConfessions(data);
    };

    const fetchTopConfessions = async () => {
      const response = await fetch("http://localhost:5000/confessions/top");
      const data = await response.json();
      setTopConfessions(data);
    };

    fetchUserData();
    fetchConfessions();
    fetchTopConfessions();
  }, []);

  const handleLike = async (id) => {
    await fetch(`http://localhost:5000/confessions/${id}/like`, {
      method: "POST",
    });
    fetchConfessions();
    fetchTopConfessions();
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/confessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipient, message: newConfession }),
      });

      if (response.ok) {
        setNewConfession("");
        setRecipient("");
        setShowForm(false);
        fetchConfessions();
        fetchTopConfessions();
      } else {
        const data = await response.json();
        console.error("Error submitting confession:", data.error);
      }
    } catch (error) {
      console.error("Error submitting confession:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-pink-600 via-red-500 to-purple-700 text-white">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
        userData={userData}
      />
      <div
        className={`flex-1 transition-all p-8 ${
          isSidebarOpen ? "ml-72" : "ml-0"
        }`}
      >
        <h1 className="text-4xl font-bold text-center mb-6">
          Anonymous Confessions
        </h1>
        <div className="grid grid-cols-2 gap-6">
          {/* Recent Confessions */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Confessions</h2>
            {confessions.map((confession) => (
              <div
                key={confession._id}
                className="p-4 bg-pink-500 rounded-lg shadow-lg mb-4"
              >
                <p className="text-lg">{confession.message}</p>
                <p className="text-sm">To: {confession.recipient}</p>
                <button
                  className="mt-2 text-yellow-300"
                  onClick={() => handleLike(confession._id)}
                >
                  ❤️ {confession.likes}
                </button>
              </div>
            ))}
          </div>

          {/* Top Confessions */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Top Confessions</h2>
            {topConfessions.map((confession) => (
              <div
                key={confession._id}
                className="p-4 bg-purple-500 rounded-lg shadow-lg mb-4"
              >
                <p className="text-lg">{confession.message}</p>
                <p className="text-sm">To: {confession.recipient}</p>
                <p className="text-yellow-300">❤️ {confession.likes}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Write Confession Button */}
        <button
          className="mt-6 p-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition"
          onClick={() => setShowForm(true)}
        >
          Write Confession
        </button>

        {/* Confession Form Modal */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gradient-to-br from-pink-700 via-red-500 to-purple-800 p-6 rounded-lg shadow-2xl w-96">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Write a Confession
              </h2>
              <input
                type="text"
                placeholder="Recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full p-2 mb-4 rounded bg-pink-600 text-white placeholder-gray-300"
              />
              <textarea
                placeholder="Your Confession"
                value={newConfession}
                onChange={(e) => setNewConfession(e.target.value)}
                className="w-full p-2 mb-4 rounded bg-pink-600 text-white placeholder-gray-300"
                rows="4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="p-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPanel;