import React, { useState } from "react";
import "./login.css";
import doImage from "../../assets/do.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!userId.trim()) return alert("Please enter User ID");
    if (!password.trim()) return alert("Please enter Password");

    setLoading(true);

    const loginData = {
      userId: userId.trim(),
      password: password.trim(),
    };

    console.log("Login attempt:", loginData);

    // Simulate login process
    setTimeout(() => {
      setUserId("");
      setPassword("");
      setLoading(false);
      navigate("/dashboard");
    }, 500);
  };

  return (
    <div className="body">
      <div className="login-card">
        <div className="logo">
          <img src={doImage} alt="logo" />
        </div>

        <h1>Welcome to Paperchime</h1>
        <p className="subtitle">Secure Document Management</p>

        <form onSubmit={handleLogin}>
          {/* User ID Input */}
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              disabled={loading}
              style={{ width: "100%" }}
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{ width: "100%" }}
            />
          </div>

          {/* Login Button */}
          <button className="otpbtn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
