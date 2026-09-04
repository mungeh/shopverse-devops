import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="brand footer-logo">
            <span className="brand-icon">S</span>

            <div>
              <span className="brand-name">ShopVerse</span>
              <span className="brand-tagline">Modern Commerce</span>
            </div>
          </Link>

          <p>
            A modern three-tier e-commerce platform powered by React,
            Go, MySQL and cloud-native DevOps technologies.
          </p>
        </div>

        <div className="footer-column">
          <h4>Shop</h4>

          <Link to="/products">All Products</Link>
          <Link to="/cart">Shopping Cart</Link>
          <Link to="/orders">My Orders</Link>
        </div>

        <div className="footer-column">
          <h4>Account</h4>

          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>

        <div className="footer-column">
          <h4>Built With</h4>

          <span>React</span>
          <span>Go Fiber</span>
          <span>MySQL</span>
          <span>Docker</span>
          <span>Kubernetes</span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} ShopVerse. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
