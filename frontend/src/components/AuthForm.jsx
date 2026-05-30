import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, saveAuthData } from "../api/authApi";

import "./AuthForm.css";

function AuthForm({ mode, setMode, showToast }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const isLogin = mode === "login";

  //Reset form when mode changes
  useEffect(() => {
    setUsername("");
    setPassword("");
  }, [mode]);


  async function handleSubmit(event) {
    event.preventDefault();

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

        showToast?.("Account created successfully. Please log in.", "success");

        setMode("login");
      }
    } catch (error) {
      showToast?.(error.message, "error");
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{isLogin ? "Login" : "Register"}</h2>

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
          onClick={() => setMode(isLogin ? "register" : "login")}
        >
          {isLogin ? "Create an account" : "Log in"}
        </button>
      </p>
    </form>
  );
}

export default AuthForm;