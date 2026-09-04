import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const destination =
    location.state?.from || "/products";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post(
        "/auth/login",
        formData
      );

      const token =
        response.data?.token ??
        response.data?.access_token;

      const user =
        response.data?.user ??
        response.data?.data?.user ??
        null;

      if (!token) {
        throw new Error(
          "Authentication token was not returned."
        );
      }

      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      window.dispatchEvent(new Event("auth-change"));

      navigate(destination, {
        replace: true,
      });
    } catch (err) {
      console.error("Login failed:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-side-panel">
        <div>
          <Link to="/" className="brand auth-brand">
            <span className="brand-icon">S</span>

            <div>
              <span className="brand-name">
                ShopVerse
              </span>

              <span className="brand-tagline">
                Modern Commerce
              </span>
            </div>
          </Link>

          <h1>Welcome back.</h1>

          <p>
            Sign in to manage your cart, create orders and
            review your purchase history.
          </p>

          <div className="auth-feature-list">
            <span>✓ Secure account access</span>
            <span>✓ Persistent shopping cart</span>
            <span>✓ Complete order history</span>
          </div>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-header">
            <span className="section-kicker">
              CUSTOMER LOGIN
            </span>

            <h2>Sign in to ShopVerse</h2>

            <p>
              Enter your account credentials below.
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account?{" "}

            <Link to="/register">
              Create an account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
