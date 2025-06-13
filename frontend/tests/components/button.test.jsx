import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../../src/components/Button";
import '@testing-library/jest-dom';


describe("Button component", () => {
    //will check that our button apprears on the screen with the Click me child (text).
    it("renders with default variant", () => {
        render(<Button>Default</Button>);
        const button = screen.getByText("Default");
        expect(button).toBeInTheDocument();
    });

    //ensures that a cancel button is disabled when needed to.
    it("renders an application of confirm, its styling and handle clicks", () => {
        const handleClick = jest.fn(); //we're creating a pretend (fake function) that we can track. 
        //fn means function
        render(<Button variant="confirm" onClick={handleClick}>Confirm</Button>);
        fireEvent.click(screen.getByText("Confirm"));
        expect(handleClick).toHaveBeenCalled();
    });

    it("renders an application of cancel, its styling and disables the button", () => {
        const handleClick = jest.fn();
        render(<Button variant="cancel" onClick={handleClick}>Cancel</Button>);
        fireEvent.click(screen.getByText("Cancel"));
        expect(handleClick).toHaveBeenCalled();
    });

    it("renders an application of logout when clicked", () => {
        const logoutClick = jest.fn();
        render(<Button onClick={logoutClick}>Logout</Button>);
        fireEvent.click(screen.getByText("Logout"));
        expect(logoutClick).toHaveBeenCalled();
    });

    it("renders an application of an aria label for accessibility", () => {
        render(<Button ariaLabel="like-post">Like</Button>);
        const button = screen.getByLabelText("like-post");
        expect(button).toBeInTheDocument();
    });

});

    it("does not call onClick handler when disabled", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Can't Click</Button>);
    fireEvent.click(screen.getByText("Can't Click"));
    expect(handleClick).not.toHaveBeenCalled();
});

    it("renders with the correct type attribute", () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByText("Submit");
    expect(button).toHaveAttribute("type", "submit");
});

    it("renders and does not error if no onClick is provided", () => {
    render(<Button>Clickless</Button>);
    const button = screen.getByText("Clickless");
    fireEvent.click(button); // should not throw even without handler
    expect(button).toBeInTheDocument();
});

    it("warns in console for invalid variant prop", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<Button variant="invalid">Oops</Button>);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
});


//render -displays the componet in our test
//screen accessed elements in the rendered output
//fireEvent is the one that simulates the clicks