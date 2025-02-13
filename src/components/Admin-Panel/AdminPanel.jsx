import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Female from "/src/assets/bitmoji/bitmofe.png";
import Male from "/src/assets/bitmoji/bitmomale.png";

const Sidebar = ({ isOpen, toggleSidebar, handleLogout, userData }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.div
      className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-br from-blue-700 via-purple-500 to-indigo-800 shadow-2xl p-6 border-r border-blue-300 flex flex-col z-50 transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      initial={{ x: -300 }}
      animate={{ x: isOpen ? 0 : -300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
            onClick={() => navigate("/adminpanel")}
            className={`block px-4 py-3 rounded-lg w-full text-left font-semibold transition ${
              location.pathname === "/adminpanel"
                ? "bg-pink-600 text-white shadow-lg scale-105"
                : "hover:bg-pink-500"
            }`}
          >
            🏠 Homepage
          </button>
        </li>
        <li>
          <Link
            to="#"
            className="block px-4 py-3 rounded-lg hover:bg-pink-500 transition font-semibold"
            onClick={toggleSidebar}
          >
            💬 Anonymous Confession
          </Link>
        </li>
        <li>
          <Link
            to="#"
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

const AdminPanel = () => {
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const [confessions, setConfessions] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      let response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        const refreshResponse = await fetch("http://localhost:5000/refresh-token", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!refreshResponse.ok) throw new Error("Token refresh failed");

        const { token: newToken } = await refreshResponse.json();
        localStorage.setItem("authToken", newToken);

        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
            "Content-Type": "application/json",
          },
        });
      }

      if (response.status === 403) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAdmin");
        navigate("/login");
        return;
      }

      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const verifyAdminAccess = async () => {
      const token = localStorage.getItem("authToken");
      const isAdmin = localStorage.getItem("isAdmin") === "true";

      if (!token || !isAdmin) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAdmin");
        navigate("/login");
        return;
      }

      try {
        // Double-check with server
        const serverCheck = await fetchWithAuth("http://localhost:5000/login/check-admin");
        if (!serverCheck.isAdmin) throw new Error("Not admin");

        // Fetch user data
        const profile = await fetchWithAuth("http://localhost:5000/userpanel");
        setUserData(profile);

        // Fetch admin data
        const [users, confessions] = await Promise.all([
          fetchWithAuth("http://localhost:5000/admin/users"),
          fetchWithAuth("http://localhost:5000/admin/confessions"),
        ]);
        setUsers(users);
        setConfessions(confessions);

        setIsLoading(false);
      } catch (err) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAdmin");
        navigate("/login");
      }
    };

    verifyAdminAccess();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  const handleDeleteConfession = async (id) => {
    try {
      await fetchWithAuth(`http://localhost:5000/admin/confessions/${id}`, {
        method: "DELETE",
      });
      setConfessions((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-500 to-indigo-700">
        <div className="text-white text-2xl">Verifying Admin Access...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-600 via-purple-500 to-indigo-700 text-white">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        userData={userData}
        handleLogout={handleLogout}
      />

      <div
        className={`flex-1 transition-all p-4 md:p-8 ${
          isSidebarOpen ? "ml-72" : "ml-0"
        } flex flex-col items-center justify-center`}
      >
        {/* Homepage with User Details and Confessions */}
        {location.pathname === "/adminpanel" && (
          <div className="w-full max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Details Box */}
              <div className="bg-white/10 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">User Details</h2>
                <div className="space-y-4">
                  <p><strong>Username:</strong> {userData?.username}</p>
                  <p><strong>Email:</strong> {userData?.email}</p>
                </div>
              </div>

              {/* Confessions Box */}
              <div className="bg-white/10 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Recent Confessions</h2>
                <div className="space-y-4">
                  {confessions.slice(0, 3).map((confession) => (
                    <div
                      key={confession._id}
                      className="border-b border-purple-400/30 pb-2 cursor-pointer"
                      onClick={() => navigate(`/confession/${confession._id}`)}
                    >
                      <p><strong>From:</strong> {confession.sender?.username || "Unknown"}</p>
                      <p><strong>To:</strong> {confession.recipient}</p>
                      <p><strong>Message:</strong> {confession.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Display Users Table */}
        <div className="w-full max-w-4xl mt-8">
          <h2 className="text-2xl font-bold mb-4">Users List</h2>
          <div className="overflow-x-auto bg-white/10 rounded-lg shadow-lg">
            <table className="w-full">
              <thead className="bg-blue-800/50">
                <tr>
                  <th className="px-4 py-3 text-left">Username</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-blue-400/30">
                    <td className="px-4 py-3">{user.username}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      <button className="mr-2 text-blue-300 hover:text-blue-100">
                        Edit
                      </button>
                      <button className="text-red-400 hover:text-red-200">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Display Confessions Table */}
        <div className="w-full max-w-4xl mt-8">
          <h2 className="text-2xl font-bold mb-4">Confessions List</h2>
          <div className="overflow-x-auto bg-white/10 rounded-lg shadow-lg">
            <table className="w-full">
              <thead className="bg-purple-800/50">
                <tr>
                  <th className="px-4 py-3 text-left">Sender</th>
                  <th className="px-4 py-3 text-left">Recipient</th>
                  <th className="px-4 py-3 text-left">Message</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {confessions.map((confession) => (
                  <tr key={confession._id} className="border-b border-purple-400/30">
                    <td className="px-4 py-3">{confession.sender?.username || "Unknown"}</td>
                    <td className="px-4 py-3">{confession.recipient}</td>
                    <td className="px-4 py-3">{confession.message}</td>
                    <td className="px-4 py-3">
                      <button
                        className="text-red-400 hover:text-red-200"
                        onClick={() => handleDeleteConfession(confession._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;