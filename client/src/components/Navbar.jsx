import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ darkMode, onToggleDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="brand-mark">Ragavi's</span>
        <span className="brand-text">RecipeHub</span>
        <span className="brand-emoji" aria-hidden="true">𓌉◯𓇋</span>
      </Link>

      <div className={`topbar-actions ${menuOpen ? 'open' : ''}`}>
        <button className="menu-button" type="button" onClick={() => setMenuOpen((value) => !value)}>
          Menu
        </button>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end>
            Feed
          </NavLink>
          {user && (
            <>
              <NavLink to="/recipes/new">Add Recipe</NavLink>
              <NavLink to="/my-recipes">My Recipes</NavLink>
              <NavLink to="/favorites">Favorites</NavLink>
              {user.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
            </>
          )}
        </nav>

        <div className="nav-actions">
          <button className="ghost-button" type="button" onClick={onToggleDarkMode}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          {user ? (
            <>
              <Link className="user-chip" to="/profile" title="Edit profile">
                <img src={user.profilePic} alt={user.username} />
                <span>@{user.username}</span>
              </Link>
              <button className="primary-button" type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="ghost-button" to="/login">
                Login
              </Link>
              <Link className="primary-button" to="/register">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
