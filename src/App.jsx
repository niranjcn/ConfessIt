import React from 'react'; // Need to import React to define components
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import UserPanel from './components/User-Panel/UserPanel.jsx'; // Make sure 'P' is capitalized
import AnonymousConfession from './components/User-Panel//AnonymousConfession';
import RandomMatchmaking from './components/User-Panel//RandomMatchmaking';

function App() {
  const isAuthenticated = localStorage.getItem('authToken');

  const handleLogout = () => {
    console.log("App - handleLogout function called"); // Added console log for verification
    localStorage.removeItem('authToken');
    // Optionally, you might want to perform other cleanup actions here,
    // like resetting user state in your App component if you are managing user data at this level.
    // No navigation here in handleLogout, navigation is handled by Sidebar after calling this function.
  };

  console.log("App - Checking handleLogout:", handleLogout, typeof handleLogout); // Added console log for verification

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/userpanel"
          element={
            isAuthenticated ? (
              <UserPanel handleLogout={handleLogout} /> // Pass handleLogout as prop to UserPanel
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/confessions" element={<AnonymousConfession />} />
        <Route path="/matchmaking" element={<RandomMatchmaking handleLogout={handleLogout} />} /> {/* Pass handleLogout to RandomMatchmaking too, if needed there */}
      </Routes>
    </Router>
  );
}

export default App;