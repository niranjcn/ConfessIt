import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom"; // For routing

const AdminDashboard = () => {
  const [confessions, setConfessions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/admin/confessions")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch confessions");
        return res.json();
      })
      .then((data) => setConfessions(data))
      .catch((err) => console.error("Error fetching confessions:", err));
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/confessions/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error deleting confession");
      setConfessions((prevConfessions) => prevConfessions.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting confession:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-pink-200 via-red-200 to-pink-300">
      {/* Sidebar */}
      <div className="w-1/5 bg-white p-6 flex flex-col items-center border-r-4 border-pink-300">
        <img src="/bitmoji.png" alt="Admin" className="w-24 h-24 rounded-full mb-4 border-4 border-pink-500" />
        <h2 className="text-2xl font-bold text-pink-600">Admin Dashboard</h2>
        <nav className="mt-6 w-full">
          <ul>
            <li className="mb-4 text-center">
              <Link
                to="/adminpanel"
                className="text-lg text-pink-700 hover:text-pink-500 transition duration-300"
              >
                Home
              </Link>
            </li>
            <li className="mb-4 text-center">
              <Link
                to="/admin/confessions"
                className="text-lg text-pink-700 hover:text-pink-500 transition duration-300"
              >
                Confessions
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-auto">
        <motion.h1 className="text-4xl font-bold text-pink-600 mb-8 text-center" animate={{ scale: 1.05 }}>
          Admin Dashboard
        </motion.h1>

        {/* Falling Petals Animation */}
        <div className="relative h-72 w-full mb-8">
          <motion.div
            className="absolute top-0 left-0 w-full h-full overflow-hidden"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage: "url('/petal.png')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
            />
          </motion.div>
        </div>

        {/* Confessions Section */}
        <div className="space-y-6">
          {confessions.map((confession) => (
            <motion.div
              key={confession._id}
              className="bg-white p-6 rounded-lg shadow-lg border-2 border-pink-300 hover:border-pink-500 transition duration-300"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-700 text-lg">{confession.text}</p>
              <p className="text-sm text-gray-500">
                From: {confession.sender} | To: {confession.receiver}
              </p>
              <div className="flex justify-between mt-4">
                <button
                  className="text-red-500 hover:text-red-700 transition duration-200"
                  onClick={() => handleDelete(confession._id)}
                >
                  <FaTrash className="text-xl" />
                </button>
                <button className="text-pink-500 hover:text-pink-700 transition duration-200">
                  <FaHeart className="text-xl" /> {confession.likes}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
