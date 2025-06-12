import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UsersForm from "../../components/UsersForm"

import { signup } from "../../services/authentication";

export function SignupPage() {
  localStorage.removeItem("token");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await signup(name, email, password);
      window.dispatchEvent(new Event("authChange"));
      navigate(`/login`);
    } catch (err) {
      console.error(err);
      navigate("/signup");
    }
  }

  function handleCancel() {
    navigate("/")
  }

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  return (
    <>
      <h2>Signup</h2>

      <UsersForm
        name={name}
        onNameChange={handleNameChange}
        showName={true}

        email={email}
        onEmailChange={handleEmailChange}
        showEmail={true}

        password={password}
        onPasswordChange={handlePasswordChange} 
        showPassword={true}

        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
      <a href="/login">
        <button>Login</button>
        </a>
    </>
  );
}
