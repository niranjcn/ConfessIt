import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import UserPanel from './components/User-Panel/UserPanel.jsx'; // Make sure 'P' is capitalized
import AnonymousConfession from './components/User-Panel//AnonymousConfession'; // Import the AnonymousConfession component
import RandomMatchmaking from './components/User-Panel//RandomMatchmaking';
import './App.css';

function App() {
  const isAuthenticated = localStorage.getItem('authToken'); // Check if the token exists

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userpanel" element={isAuthenticated ? <UserPanel /> : <Navigate to="/login" />} /> {/* Protected Route */}
        <Route path="/confessions" element={<AnonymousConfession />} /> {/* Route to AnonymousConfession */}
        <Route path="/matchmaking" element={<RandomMatchmaking />} /> {/* Route to RandomMatchmaking */}

      </Routes>
    </Router>
  );
}

export default App;
