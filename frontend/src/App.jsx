import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import RegistrationForm from './pages/RegistrationForm.jsx';
import PeopleList from './pages/PeopleList.jsx';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
            <span className="nav-icon">👥</span>
            <span className="nav-title">People Manager</span>
          </div>
          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Register
            </NavLink>
            <NavLink to="/people" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              People List
            </NavLink>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<RegistrationForm />} />
            <Route path="/people" element={<PeopleList />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>Person Management System &copy; 2026</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
