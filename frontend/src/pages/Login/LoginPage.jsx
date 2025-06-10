import { useState } from "react";
import { useNavigate } from "react-router-dom";

import UsersForm from "../../components/UsersForm"

import { login } from "../../services/authentication";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const token = await login(email, password);
      localStorage.setItem("token", token);
      navigate("/posts");
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  return (
    <>
      <h2>Login</h2>
      <UsersForm
        email={email}
        onEmailChange={handleEmailChange}
        showEmail={true}

        password={password}
        onPasswordChange={handlePasswordChange} 
        showPassword={true}

        onSubmit={handleSubmit}
        />
    </>
  );
}
