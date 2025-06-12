
import { render, screen, fireEvent } from "@testing-library/react";
import UsersForm from "../../components/UsersForm";

describe("UsersForm", () => {
  const mockProps = {
    onSubmit: jest.fn((e) => e.preventDefault()),
    onCancel: jest.fn(),
    onNameChange: jest.fn(),
    onEmailChange: jest.fn(),
    onPasswordChange: jest.fn(),
    onLocationChange: jest.fn(),
    onBioChange: jest.fn(),
    onDOBChange: jest.fn(),
    onStatusChange: jest.fn(),
    name: "",
    email: "",
    password: "",
    location: "",
    bio: "",
    dob: "2000-01-01",
    status: "",
    showName: true,
    showEmail: true,
    showPassword: true,
    showLocation: true,
    showBio: true,
    showDOB: true,
    showStatus: true,
  };

  it("renders all visible fields when flags are true", () => {
    render(<UsersForm {...mockProps} />);
    
    expect(screen.getByLabelText("Name*")).toBeInTheDocument();
    expect(screen.getByLabelText("Email*")).toBeInTheDocument();
    expect(screen.getByLabelText("Password*")).toBeInTheDocument();
    expect(screen.getByLabelText("Location, as if anyone cares.")).toBeInTheDocument();
    expect(screen.getByLabelText("Bio, try not to be boring.")).toBeInTheDocument();
    expect(screen.getByLabelText("Date of Birth, show us how close to dying you are.")).toBeInTheDocument();
    expect(screen.getByLabelText("Status, don't be gross about it.")).toBeInTheDocument();
    expect(screen.getByRole("submit-button")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls change handlers when fields are updated", () => {
    render(<UsersForm {...mockProps} />);

    fireEvent.change(screen.getByLabelText("Name*"), { target: { value: "New Name" } });
    expect(mockProps.onNameChange).toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Email*"), { target: { value: "test@email.com" } });
    expect(mockProps.onEmailChange).toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Password*"), { target: { value: "secret" } });
    expect(mockProps.onPasswordChange).toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Location, as if anyone cares."), { target: { value: "London" } });
    expect(mockProps.onLocationChange).toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Bio, try not to be boring."), { target: { value: "Hello world" } });
    expect(mockProps.onBioChange).toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Date of Birth, show us how close to dying you are."), { target: { value: "1990-01-01" } });
    expect(mockProps.onDOBChange).toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Status, don't be gross about it."), { target: { value: "Single" } });
    expect(mockProps.onStatusChange).toHaveBeenCalled();
  });

  it("calls onSubmit when the form is submitted", () => {
    render(<UsersForm {...mockProps} />);
    const form = screen.getByRole("form", { hidden: true }) || screen.getByRole("form");

    fireEvent.submit(form);
    expect(mockProps.onSubmit).toHaveBeenCalled();
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(<UsersForm {...mockProps} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockProps.onCancel).toHaveBeenCalled();
  });

  it("renders only selected fields when flags are false", () => {
    const minimalProps = {
      ...mockProps,
      showName: false,
      showEmail: false,
      showPassword: false,
      showLocation: false,
      showBio: false,
      showDOB: false,
      showStatus: false,
    };

    render(<UsersForm {...minimalProps} />);
    expect(screen.queryByLabelText("Name*")).toBeNull();
    expect(screen.queryByLabelText("Email*")).toBeNull();
    expect(screen.queryByLabelText("Password*")).toBeNull();
    expect(screen.queryByLabelText("Location, as if anyone cares.")).toBeNull();
    expect(screen.queryByLabelText("Bio, try not to be boring.")).toBeNull();
    expect(screen.queryByLabelText("Date of Birth, show us how close to dying you are.")).toBeNull();
    expect(screen.queryByLabelText("Status, don't be gross about it.")).toBeNull();
  });
});
