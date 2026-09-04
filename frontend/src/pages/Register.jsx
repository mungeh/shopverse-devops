import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    setError("");

    if (formData.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");

      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/login", {
        replace: true,
      });
    } catch (err) {
      console.error("Registration failed:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-side-panel register-panel">
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

          <h1>Create your ShopVerse account.</h1>

          <p>
            Register once and manage your cart and orders
            securely from one place.
          </p>

          <div className="auth-feature-list">
            <span>✓ Browse the full catalog</span>
            <span>✓ Save products to your cart</span>
            <span>✓ Create and review orders</span>
          </div>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-header">
            <span className="section-kicker">
              CREATE ACCOUNT
            </span>

            <h2>Join ShopVerse</h2>

            <p>
              Enter your information to create a customer
              account.
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
              <label htmlFor="name">
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
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
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Enter password again"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <div className="auth-switch">
            Already registered?{" "}

            <Link to="/login">
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Register;
