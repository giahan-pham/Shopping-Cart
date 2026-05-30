import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, saveAuthData } from "../api/authApi";

import "./AuthForm.css";

function AuthForm({ mode, setMode }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isLogin = mode === "login";

  //Reset form when mode changes
  useEffect(() => {
    setUsername("");
    setPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  }, [mode]);


  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (isLogin) {
        const data = await loginUser(username, password);

        saveAuthData(data);

        if (data.role === "admin") {
          navigate("/admin/records");
        } else {
          navigate("/records");
        }
      } else {
        await registerUser({ username, password });

        setSuccessMessage(
          "Account created successfully. Please log in."
        );

        setMode("login");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{isLogin ? "Login" : "Register"}</h2>

      {errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}

      {successMessage && (
        <p className="success-message">{successMessage}</p>
      )}

      <label>
        Username
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>

      <button type="submit">
        {isLogin ? "Login" : "Create account"}
      </button>

      <p className="auth-switch-text">
        {isLogin ? "New here?" : "Already have an account?"}{" "}
        <button
          type="button"
          className="auth-switch-button"
          onClick={() => {
            setErrorMessage("");
            setSuccessMessage("");
            setMode(isLogin ? "register" : "login");
          }}
        >
          {isLogin ? "Create an account" : "Log in"}
        </button>
      </p>
    </form>
  );
}

export default AuthForm;