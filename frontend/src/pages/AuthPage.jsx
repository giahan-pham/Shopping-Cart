import { useState } from "react";

import AuthForm from "../components/AuthForm";

import "./AuthPage.css";

//Auth page where user can switch between login and register form using tabs
function AuthPage({ showToast }) {
  const [mode, setMode] = useState("login");

  return (
    <main className="auth-page">
      <section className="auth-container">
        <h1 className="auth-title">Record Store</h1>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "login" ? "auth-tab active" : "auth-tab"}
            onClick={() => setMode("login")}
          >
            Login
          </button>

          <button
            type="button"
            className={mode === "register" ? "auth-tab active" : "auth-tab"}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <AuthForm mode={mode} setMode={setMode} showToast={showToast} />
      </section>
    </main>
  );
}

export default AuthPage;