import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UsersForm from "../../components/UsersForm";
import { UserPlus } from "lucide-react";
import Button from "../../components/Button";

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
    navigate("/");
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
    <div className="authPageWrapper">
      <div className="userFormContainer">
        <h2>Sign Up</h2>
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
        <div className="authLinkBtn">
          <a href="/login">
            <Button
              buttonText="Login"
              buttonIcon={<UserPlus className="btn-icon" />}
              optionalStyling="action-btn"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
