import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import Button from "../../components/Button";

import UsersForm from "../../components/UsersForm"

import { login } from "../../services/authentication";

export function LoginPage() {
  localStorage.removeItem("token");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await login(email, password);
      localStorage.setItem("token", response.token);
      localStorage.setItem("userId", response.userId);
      window.dispatchEvent(new Event("authChange"));
      navigate(`/posts/feed/${response.userId}`);

    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  }

  function handleCancel() {
    navigate("/")
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  return (
    <div className="authPageWrapper">
    <div className="userFormContainer">
      <h2>Login</h2>
      <UsersForm
        email={email}
        onEmailChange={handleEmailChange}
        showEmail={true}

        password={password}
        onPasswordChange={handlePasswordChange} 
        showPassword={true}

        onSubmit={handleSubmit}
        onCancel={handleCancel}
        />
        <div className="authLinkBtn">
        <a href="/signup">
          <Button 
            buttonText="Sign Up!"
            buttonIcon={<UserPlus className="btn-icon" />}
            optionalStyling="action-btn"
          />
        </a>
      </div>
    </div>
  </div>
);
}
