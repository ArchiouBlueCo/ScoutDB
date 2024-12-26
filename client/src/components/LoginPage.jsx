import React, { useState } from "react";
import { apiService } from "../services/apiService.js";
import { useNavigate } from "react-router-dom";  // React Router for navigation
import './css/LoginPage.css'
import logo from '/chelsea.png';
import './css/responsive/LoginPage.css'
import LoadingScreen from "./Loading.jsx";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // React Router's hook to navigate to other routes
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiService.post("/scouts/signin/", {Email : email, Password: password}, {
        headers: {
          'Content-Type': 'application/json'
        }, });

      if (response) {
        // Store the token (optional - for authentication purposes)
        localStorage.setItem("jwtToken", response["token"]);
        localStorage.setItem("name", response["name"]);
        localStorage.setItem("_id", response["scoutId"]);

        // Redirect to the dashboard page after successful login
        navigate("/dashboard", { state: { message: response["scoutId"] , _scoutName: response["name"]} });
      } else {
        // Show error message if credentials are wrong
        setErrorMessage("Invalid email or password. Please try again.");
      }
    } catch (error) {
      // Handle any error that occurs during login
      setErrorMessage("Invalid email or password. Please try again");
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="welcome-logo">
        <img src={logo} alt="" />
        <h1 >Achirou</h1>
        <h1>Elite Scouting</h1>
      </div>
      <div className="login-box">
        {loading && <LoadingScreen/>}
        <h1>Scout Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          {/* Error message displayed conditionally */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
        <div className="additional-options">
          {/* <a href="#">Forgot Password?</a> */}
        </div>
      </div>
  </div>

  );
};

export default LoginPage;
