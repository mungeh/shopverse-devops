import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("token")));

      const savedUser = localStorage.getItem("user");

      try {
        setUser(savedUser ? JSON.parse(savedUser) : null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-change", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsAuthenticated(false);
    setUser(null);

    window.dispatchEvent(new Event("auth-change"));

    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    isActive ? "nav-link nav-link-active" : "nav-link";

  return (
    <header className="site-header">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="brand">
            <span className="brand-icon">S</span>

            <div>
              <span className="brand-name">ShopVerse</span>
              <span className="brand-tagline">Modern Commerce</span>
            </div>
          </Link>

          <div className="navbar-links">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>

            <NavLink to="/products" className={navClass}>
              Products
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink to="/cart" className={navClass}>
                  Cart
                </NavLink>

                <NavLink to="/orders" className={navClass}>
                  Orders
                </NavLink>
              </>
            )}
          </div>

          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                <span className="welcome-text">
                  {user?.name ? `Hi, ${user.name}` : "My Account"}
                </span>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>

                <Link to="/register" className="btn btn-primary">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
