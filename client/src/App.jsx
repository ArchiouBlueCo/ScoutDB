import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";  // A placeholder page for after login
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {

  return (
    <Router>
      <Routes>

        {/* Route for login page */}
        <Route path="/" element={<LoginPage />} />

        {/* Route for dashboard or a protected page */}
        <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* <Route path="*" element={<Navigate to="/" />} /> */}

      </Routes>
    </Router>
  );
};

export default App;
