import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SignupPage from "../views/pages/SignupPage";
import { useSignup } from "../hooks/useSignup";

jest.mock("../hooks/useSignup");

const mockUseSignup = useSignup as jest.MockedFunction<typeof useSignup>;

describe("SignupPage", () => {
  it("renders signup form", () => {
    mockUseSignup.mockReturnValue({
      name: "",
      setName: jest.fn(),
      email: "",
      setEmail: jest.fn(),
      password: "",
      setPassword: jest.fn(),
      nameError: "",
      emailError: "",
      passwordError: "",
      submitError: "",
      handleSignup: jest.fn(),
      loading: false,
    });

    render(<SignupPage />);
    expect(screen.getByText("Create Your Account")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("disables form on loading", () => {
    mockUseSignup.mockReturnValue({
      name: "User",
      setName: jest.fn(),
      email: "user@example.com",
      setEmail: jest.fn(),
      password: "12345678",
      setPassword: jest.fn(),
      nameError: "",
      emailError: "",
      passwordError: "",
      submitError: "",
      handleSignup: jest.fn(),
      loading: true,
    });

    render(<SignupPage />);
    expect(screen.getByRole("form")).toHaveStyle("opacity: 0.5");
  });

  it("shows field and submit errors", () => {
    mockUseSignup.mockReturnValue({
      name: "",
      setName: jest.fn(),
      email: "",
      setEmail: jest.fn(),
      password: "",
      setPassword: jest.fn(),
      nameError: "Name required",
      emailError: "Email invalid",
      passwordError: "Weak password",
      submitError: "Signup failed",
      handleSignup: jest.fn(),
      loading: false,
    });

    render(<SignupPage />);
    expect(screen.getByText("Name required")).toBeInTheDocument();
    expect(screen.getByText("Email invalid")).toBeInTheDocument();
    expect(screen.getByText("Weak password")).toBeInTheDocument();
    expect(screen.getByText("Signup failed")).toBeInTheDocument();
  });
});
