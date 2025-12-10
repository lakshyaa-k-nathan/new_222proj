import { useState } from "react";
import "../styles/login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");


  const submit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Enter email + password");
      return;
    }
    onLogin(email); // fake login, simple for demo
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>SafeWalk Login</h2>
        <p className="login-subtitle">Sign in to continue</p>

        <form className="login-form" onSubmit={submit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Log In</button>
        </form>
        <p className="login-switch">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => setMode("login")}
              >
                Log In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
