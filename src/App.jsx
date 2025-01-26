// App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import './App.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Redirect from homepage to register page */}
          <Route path="/" element={<Register />} /> 
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

