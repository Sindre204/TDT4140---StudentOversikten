import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { vi, describe, test, expect, beforeEach } from "vitest";
import { MyProfile } from "../src/pages/MyProfile";
import { useAuth } from "../src/context/AuthContext";

vi.mock("../src/context/AuthContext");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: vi.fn() };
});

describe("MyProfile Component", () => {
  const mockLogout = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  test("viser innloggingsmelding når ingen bruker finnes", () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, logout: mockLogout });

    render(
      <MemoryRouter>
        <MyProfile />
      </MemoryRouter>
    );

    expect(screen.getByText(/vennligst logg inn for å se profilen din/i)).toBeInTheDocument();
  });

  test("viser brukerinfo og logger ut ved klikk", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        fullName: "Test Navn",
        email: "test@bruker.no",
        role: "company",
      },
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <MyProfile />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /min profil/i })).toBeInTheDocument();
    expect(screen.getByText(/test navn/i)).toBeInTheDocument();
    expect(screen.getByText(/test@bruker.no/i)).toBeInTheDocument();
    expect(screen.getAllByText(/bedrift/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /logg ut/i }));

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
