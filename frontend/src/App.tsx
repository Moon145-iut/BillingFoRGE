import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminPage from './pages/Admin';
import UserPage from './pages/User';

const Header: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <header className="app-header">
      <div className="logo">
        <span role="img" aria-label="calculator">
          🧮
        </span>
        BillCalc
      </div>
      <nav>
        <Link className={pathname === '/' ? 'active' : ''} to="/">
          Calculator
        </Link>
        <Link className={pathname === '/admin' ? 'active' : ''} to="/admin">
          Admin Portal
        </Link>
      </nav>
    </header>
  );
};

const App: React.FC = () => (
  <Router>
    <Header />
    <main className="app-main">
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<UserPage />} />
      </Routes>
    </main>
  </Router>
);

export default App;
