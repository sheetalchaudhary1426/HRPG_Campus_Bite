
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Mail,
  UserRound,
  LockKeyhole,
} from "lucide-react";
import Brand from "../../components/Brand.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.authenticated) {
        navigate(
          result.user?.role === "admin" ? "/admin" : "/student",
          { replace: true }
        );
      } else {
        navigate("/login", {
          replace: true,
          state: {
            message: "Account created successfully. Please sign in.",
          },
        });
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <Brand />

          <div className="auth-message">
            <span className="eyebrow light-eyebrow">
              A BETTER BREAK STARTS HERE
            </span>

            <h1>
              Your time.
              <br />
              <em>Your table.</em>
            </h1>

            <p>
              Discover campus favourites and make every break a little
              more delicious.
            </p>
          </div>

          <div className="auth-visual-footer">
            MADE FOR CAMPUS LIFE <span>© 2026 HRPG Campus Bite</span>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand">
            <Brand />
          </div>

          <span className="eyebrow">GET STARTED</span>
          <h2>Create your account</h2>
          <p className="auth-intro">
            Join your campus food community.
          </p>

          <form
            className="auth-form register-form"
            onSubmit={handleSubmit}
          >
            <label htmlFor="register-name">Full name</label>

            <div className="input-wrap">
              <UserRound size={18} />
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your full name"
              />
            </div>

            <label htmlFor="register-email">Campus email</label>

            <div className="input-wrap">
              <Mail size={18} />
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@campus.edu"
              />
            </div>

            <label htmlFor="register-password">Password</label>

            <div className="input-wrap">
              <LockKeyhole size={18} />
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
              />
            </div>

            <label htmlFor="register-confirm-password">
              Confirm password
            </label>

            <div className="input-wrap">
              <LockKeyhole size={18} />
              <input
                id="register-confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Enter your password again"
              />
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="primary-button full-button"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Creating account..." : "Create account"}
              {!submitting && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="auth-switch-copy">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

          <p className="auth-terms">
            Admin access is created by your campus administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
