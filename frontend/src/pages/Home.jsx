import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span>SHOPVERSE</span>
            <span className="hero-eyebrow-dot"></span>
            <span>Modern E-Commerce</span>
          </div>

          <h1>
            Discover products
            <span className="gradient-text"> built for your lifestyle.</span>
          </h1>

          <p className="hero-description">
            Browse quality products, manage your shopping cart,
            create secure orders and enjoy a modern shopping
            experience from any device.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-large">
              Explore Products
            </Link>

            <Link to="/register" className="btn btn-outline btn-large">
              Create Account
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <strong>100+</strong>
              <span>Products</span>
            </div>

            <div>
              <strong>Secure</strong>
              <span>Authentication</span>
            </div>

            <div>
              <strong>Cloud</strong>
              <span>Ready</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-dashboard-card">
            <div className="dashboard-header">
              <div>
                <span className="dashboard-label">ShopVerse</span>
                <h3>Your Marketplace</h3>
              </div>

              <span className="dashboard-status">Online</span>
            </div>

            <div className="dashboard-main">
              <div className="dashboard-feature">
                <span className="dashboard-icon">🛍️</span>

                <div>
                  <span>Shop Anywhere</span>
                  <strong>Modern experience</strong>
                </div>
              </div>

              <div className="dashboard-feature">
                <span className="dashboard-icon">🔐</span>

                <div>
                  <span>Secure Account</span>
                  <strong>JWT authentication</strong>
                </div>
              </div>

              <div className="dashboard-feature">
                <span className="dashboard-icon">📦</span>

                <div>
                  <span>Your Orders</span>
                  <strong>Simple tracking</strong>
                </div>
              </div>
            </div>

            <div className="dashboard-footer">
              React
              <span>•</span>
              Go
              <span>•</span>
              MySQL
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="section-kicker">WHY SHOPVERSE</span>

          <h2>Shopping designed to feel simple</h2>

          <p>
            Everything you need for a reliable modern
            e-commerce experience.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon">⚡</div>

            <h3>Fast Experience</h3>

            <p>
              A lightweight React frontend delivers a responsive and
              fast shopping experience.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">🔒</div>

            <h3>Secure Authentication</h3>

            <p>
              Register and login securely before accessing protected
              account resources.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">🛒</div>

            <h3>Simple Cart</h3>

            <p>
              Add products, change quantities, remove items and
              prepare your order.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">📦</div>

            <h3>Order History</h3>

            <p>
              Review previously created orders from your secure
              customer account.
            </p>
          </article>
        </div>
      </section>

      <section className="tech-section">
        <div className="tech-content">
          <div>
            <span className="section-kicker">CLOUD NATIVE</span>

            <h2>Built as a real three-tier application</h2>

            <p>
              The ShopVerse frontend communicates with a Go REST API,
              which persists application data in MySQL.
            </p>
          </div>

          <div className="architecture-preview">
            <div className="architecture-box">
              <span>Frontend</span>
              <strong>React + Vite</strong>
            </div>

            <span className="architecture-arrow">→</span>

            <div className="architecture-box">
              <span>API</span>
              <strong>Go Fiber</strong>
            </div>

            <span className="architecture-arrow">→</span>

            <div className="architecture-box">
              <span>Database</span>
              <strong>MySQL</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div>
          <span className="section-kicker light-kicker">
            START SHOPPING
          </span>

          <h2>Find your next favorite product.</h2>

          <p>
            Explore the ShopVerse catalog and add products to your
            account.
          </p>
        </div>

        <Link to="/products" className="btn btn-light btn-large">
          Browse Products
        </Link>
      </section>
    </>
  );
}

export default Home;
