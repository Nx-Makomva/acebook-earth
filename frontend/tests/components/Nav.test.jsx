
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Nav from "../../components/Nav";

const mockUsers = [
  { _id: "1", name: "max" },
  { _id: "2", name: "jessie" },
];

describe("Nav", () => {
  const logo = "logo.png";
  const mockOnSearch = jest.fn();
  const mockAddFriend = jest.fn();

  beforeEach(() => {
    localStorage.setItem("userId", "123");
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renders the logo and navigation icons", () => {
    render(<Nav logo={logo} onSearch={mockOnSearch} users={[]} addFriend={mockAddFriend} />);
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "" })).toHaveAttribute("href", "/posts/feed/123");
  });

  it("calls the onSearch after typing and debouncing", async () => {
    render(<Nav logo={logo} onSearch={mockOnSearch} users={[]} addFriend={mockAddFriend} />);
    const input = screen.getByPlaceholderText("Search for anything...");

    fireEvent.change(input, { target: { value: "jessie" } });

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("jessie");
    });
  });

  it("shows search results when users are found", async () => {
    render(<Nav logo={logo} onSearch={mockOnSearch} users={mockUsers} addFriend={mockAddFriend} />);
    const input = screen.getByPlaceholderText("Search for anything...");

    fireEvent.change(input, { target: { value: "max" } });
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText("max")).toBeInTheDocument();
    });
  });

  it("shows 'No users found' when users array is empty", async () => {
    render(<Nav logo={logo} onSearch={mockOnSearch} users={[]} addFriend={mockAddFriend} />);
    const input = screen.getByPlaceholderText("Search for anything...");

    fireEvent.change(input, { target: { value: "nothing" } });
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText("No users found")).toBeInTheDocument();
    });
  });

  it("toggles profile dropdown menu on menu button click", () => {
    render(<Nav logo={logo} onSearch={mockOnSearch} users={[]} addFriend={mockAddFriend} />);
    const menuButton = screen.getByRole("button");

    fireEvent.click(menuButton);

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Account Settings")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });
});
