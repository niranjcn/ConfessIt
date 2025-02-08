import React, { useState, useEffect } from 'react'; // Or just import React if you are not using hooks directly in this component level import statement, but including hooks like useState, useEffect is common practice.
import './LoveWheel.css';
import Female from "/src/assets/bitmoji/bitmofe.png";
import Male from "/src/assets/bitmoji/bitmomale.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Sidebar Component
const Sidebar = ({ isOpen, toggleSidebar, handleLogout, userData }) => {
    const navigate = useNavigate();
    console.log("Sidebar Component - userData prop received:", userData);

    const handleLogoutClick = () => {
        console.log("Sidebar - Logout button clicked"); // ADD THIS LINE
        console.log("Sidebar - Calling handleLogout function..."); // ADD THIS LINE
        handleLogout();
        console.log("Sidebar - handleLogout function called"); // ADD THIS LINE
        console.log("Sidebar - Navigating to /login..."); // ADD THIS LINE
        navigate("/login");
        console.log("Sidebar - navigate('/login') called"); // ADD THIS LINE
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

            {/* Profile Section with proper user data handling */}
            <div className="flex flex-col items-center text-white border-b border-gray-500 pb-6">
                <img
                    src={userData?.gender === "Male" ? Male : Female}
                    alt="Bitmoji"
                    className="w-24 h-24 rounded-full mb-3 border-4 border-yellow-300 shadow-lg"
                />
                <p className="text-lg font-semibold">
                    {userData?.username || "Loading..."}
                </p>
                <p className="text-sm text-gray-300">
                    {userData?.email}
                </p>
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
                    onClick={handleLogoutClick} // Changed to call handleLogoutClick
                    className="w-full p-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>
        </motion.div>
    );
};

// Heart Component (no changes needed)
const Heart = ({ x, size }) => {
    const [posX, setPosX] = useState(x);
    const [posY, setPosY] = useState(-20);

    useEffect(() => {
        let animationFrame;
        const fall = () => {
            setPosY(prevY => (prevY > window.innerHeight ? -size : prevY + 2));
            animationFrame = requestAnimationFrame(fall);
        };
        fall();
        return () => cancelAnimationFrame(animationFrame);
    }, [size]);

    const handleMouseMove = (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const dx = posX - mouseX;
        const dy = posY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 100;

        if (distance < repelRadius) {
            const angle = Math.atan2(dy, dx);
            setPosX(posX + Math.cos(angle) * 50);
            setPosY(posY + Math.sin(angle) * 50);
        }
    };

    return (
        <div
            className="heart"
            style={{ left: posX, top: posY, width: size, height: size }}
            onMouseMove={handleMouseMove}
        ></div>
    );
};

// LoveWheel Component (no changes needed)
const LoveWheel = () => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [leftBitmoji, setLeftBitmoji] = useState('😊');
    const [rightBitmoji, setRightBitmoji] = useState('😊');
    const [waterLevel, setWaterLevel] = useState(0);
    const [hearts, setHearts] = useState([])

    const bitmojis = ['😊', '😍', '🥰', '😘', '🤩', '😎', '🥳', '😇']

    useEffect(() => {
        const maxHearts = 25; // Set the maximum number of hearts you want on screen  <-- ADJUST THIS VALUE
        const createHeart = () => ({
            x: Math.random() * window.innerWidth,
            size: Math.random() * 20 + 10,
        });

        const interval = setInterval(() => {
            if (hearts.length < maxHearts) { // Check if we are below the heart limit
                setHearts(prevHearts => [...prevHearts, createHeart()]); // Add a new heart only if below limit
            }
        }, 1500); // Heart creation interval (adjust as needed)

        return () => clearInterval(interval);
    }, [hearts]);

    const handleMatch = () => {
        setIsAnimating(true);
        setWaterLevel(0);
        animateWaterFill();
        animateBitmojis();
    };

    const animateWaterFill = () => {
        let level = 0;
        const interval = setInterval(() => {
            level += 1;
            setWaterLevel(level);
            if (level >= 100) {
                clearInterval(interval);
                setIsAnimating(false);
            }
        }, 70);
    };

    const animateBitmojis = () => {
        let count = 0;
        const interval = setInterval(() => {
            setLeftBitmoji(bitmojis[Math.floor(Math.random() * bitmojis.length)]);
            setRightBitmoji(bitmojis[Math.floor(Math.random() * bitmojis.length)]);
            count += 1;
            if (count >= 70) {
                clearInterval(interval);
            }
        }, 100);
    };

    return (
        <div className="love-wheel-container">
            {hearts.map((heart, index) => (
                <Heart key={index} x={heart.x} size={heart.size} />
            ))}
            <div className="bitmoji-container">
                <div className="bitmoji-box">
                    <div className="bitmoji">{leftBitmoji}</div>
                </div>
                <div className="heart-container">
                    <div className="water-fill" style={{ height: `${waterLevel}%` }}></div>
                </div>
                <div className="bitmoji-box">
                    <div className="bitmoji">{rightBitmoji}</div>
                </div>
            </div>
            <button className="match-button" onClick={handleMatch} disabled={isAnimating}>
                Match
            </button>
        </div>
    );
};

// LoveWheelSection Component
const LoveWheelSection = ({ handleLogout }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar is open by default
    const [userData, setUserData] = useState(null); // userData state moved to LoveWheelSection
    const [isUserDataLoading, setIsUserDataLoading] = useState(true); // Optional: loading state
    console.log("LoveWheelSection - handleLogout prop received:", handleLogout); // ADD THIS LINE

    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            setIsUserDataLoading(true); // Optional: set loading state to true
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.error("No token found");
                navigate('/login'); // Redirect to login if no token
                setIsUserDataLoading(false); // Optional: loading finished (even with error)
                return;
            }
            try {
                console.log("LoveWheelSection - Fetching user data..."); // Log here in LoveWheelSection
                const response = await fetch("http://localhost:5000/userpanel", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                console.log("LoveWheelSection - API Response:", data); // Log response in LoveWheelSection
                if (response.ok) {
                    setUserData(data);
                    console.log("LoveWheelSection - User data set in state:", data); // Log data set
                } else {
                    console.error("LoveWheelSection - Error fetching user data:", data.error);
                    // Handle error appropriately, maybe redirect to an error page or display a message
                }
            } catch (error) {
                console.error("LoveWheelSection - Error during fetch:", error);
                // Handle network errors or exceptions
            } finally {
                setIsUserDataLoading(false); // Optional: set loading state to false when fetch finishes
            }
        };
        fetchUserData();
    }, [navigate]); // Added navigate to dependency array

    const sectionHandleLogout = () => {
        console.log("LoveWheelSection - sectionHandleLogout called"); // ADD THIS LINE
        handleLogout();
        console.log("LoveWheelSection - handleLogout() executed"); // ADD THIS LINE
    };

    console.log("LoveWheelSection - userData state:", userData);

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-pink-700 via-red-500 to-purple-800 overflow-hidden"> {/* Full screen background wrapper */}
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                handleLogout={sectionHandleLogout} // Changed to sectionHandleLogout
                userData={userData} // Pass userData state as prop to Sidebar
            />
            <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'} flex flex-col items-center justify-center h-screen`}> {/* Content wrapper with dynamic margin */}
                <button
                    onClick={toggleSidebar}
                    className="absolute top-4 left-4 text-white text-2xl z-50"
                >
                    ☰
                </button>
                <LoveWheel />
            </div>
        </div>
    );
};

export default LoveWheelSection;