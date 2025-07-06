import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../views/pages/LoginPage";
import { useLogin } from "../hooks/useLogin";

jest.mock("../hooks/useLogin");

const mockUseLogin = useLogin as jest.MockedFunction<typeof useLogin>;

describe("LoginPage", () => {
  it("renders login form correctly", () => {
    mockUseLogin.mockReturnValue({
      email: "",
      setEmail: jest.fn(),
      password: "",
      setPassword: jest.fn(),
      emailError: "",
      passwordError: "",
      submitError: "",
      loading: false,
      handleSubmit: jest.fn(),
    });

    render(<LoginPage />);
    expect(screen.getByText("Welcome to Our Application")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("shows loading spinner and disables inputs on submit", () => {
    mockUseLogin.mockReturnValue({
      email: "test@example.com",
      setEmail: jest.fn(),
      password: "password123",
      setPassword: jest.fn(),
      emailError: "",
      passwordError: "",
      submitError: "",
      loading: true,
      handleSubmit: jest.fn(),
    });

    render(<LoginPage />);
    expect(screen.getByText("Logging in...")).toBeDisabled();
    expect(
      screen.getByText(/Please enter your login credentials/)
    ).toBeInTheDocument();
  });

  it("displays error messages", () => {
    mockUseLogin.mockReturnValue({
      email: "",
      setEmail: jest.fn(),
      password: "",
      setPassword: jest.fn(),
      emailError: "Invalid email",
      passwordError: "Password required",
      submitError: "Something went wrong",
      loading: false,
      handleSubmit: jest.fn(),
    });

    render(<LoginPage />);
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
    expect(screen.getByText("Password required")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
