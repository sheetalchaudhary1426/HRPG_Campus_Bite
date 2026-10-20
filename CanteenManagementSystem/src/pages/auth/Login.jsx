
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import Brand from "../../components/Brand.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("student@campus.edu");
  const [password, setPassword] = useState("student123");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // The backend determines the user's actual role.
      const user = await login({ email: email.trim(), password });

      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/student", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
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
              YOUR CAMPUS, REIMAGINED
            </span>

            <h1>
              Good food.
              <br />
              <em>No waiting.</em>
            </h1>

            <p>
              Order ahead, skip the queue, and spend your break doing what
              you love.
            </p>

            <div className="auth-visual-note">
              <span className="live-dot" />
              Canteen is serving now <span>·</span> HRPG Campus Bite
            </div>
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

          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to HRPG Campus Bite</h2>
          <p className="auth-intro">
            Your next favourite meal is just a few clicks away.
          </p>

          <div className="role-switch" role="group" aria-label="Account type">
            <button
              className={role === "student" ? "selected" : ""}
              onClick={() => {
                setRole("student");
                setEmail("student@campus.edu");
                setPassword("student123");
                setError("");
              }}
              type="button"
            >
              Student
            </button>

            <button
              className={role === "admin" ? "selected" : ""}
              onClick={() => {
                setRole("admin");
                setEmail("admin@campus.edu");
                setPassword("Admin@123");
                setError("");
              }}
              type="button"
            >
              Admin
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="login-email">Email address</label>

            <div className="input-wrap">
              <Mail size={18} />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@campus.edu"
              />
            </div>

            <label htmlFor="login-password">Password</label>

            <div className="input-wrap">
              <LockKeyhole size={18} />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>

            <div className="form-row">
              <label className="remember-label">
                <input type="checkbox" defaultChecked />
                Remember me
              </label>

              <a
                href="#forgot"
                onClick={(event) => event.preventDefault()}
              >
                Forgot password?
              </a>
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
              {submitting ? "Signing in..." : "Sign in"}
              {!submitting && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="demo-note">
            <strong>{role === "admin" ? "Admin sign in" : "Student sign in"}</strong>
            <span>
              {role === "admin"
                ? "Use the seeded admin account: admin@campus.edu / Admin@123"
                : "Use an account registered in your backend. The selected tab does not grant a role; access is determined by the server."}
            </span>
          </div>

          <p className="auth-switch-copy">
            New to HRPG Campus Bite? <Link to="/register">Create an account</Link>
          </p>

          <p className="auth-terms">
            By continuing, you agree to our <a href="#terms">Terms</a> and{" "}
            <a href="#privacy">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
