import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useNavigate, MemoryRouter } from "react-router-dom";
import { vi, describe, test, expect, beforeEach } from "vitest";
import { CreateUser } from "../src/pages/CreateUser";
import { useAuth } from "../src/context/AuthContext";

vi.mock("../src/context/AuthContext");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: vi.fn() };
});

describe("CreateUser Component", () => {
  const mockRegister = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useAuth).mockReturnValue({ register: mockRegister });
  });

  test("viser feilmelding hvis passordet er for kort", async () => {
    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/fullt navn/i), { target: { value: "Test Bruker" } });
    fireEvent.change(screen.getByLabelText(/e-post/i), { target: { value: "test@test.no" } });
    fireEvent.change(screen.getByLabelText(/^passord$/i), { target: { value: "123" } });
    fireEvent.change(screen.getByLabelText(/bekreft passord/i), { target: { value: "123" } });

    fireEvent.click(screen.getByRole("button", { name: /lag ny bruker/i }));

    expect(await screen.findByText(/passordet må være minst 6 tegn langt/i)).toBeInTheDocument();
  });

  test("viser feilmelding hvis passordene ikke er like", async () => {
    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/fullt navn/i), { target: { value: "Test Bruker" } });
    fireEvent.change(screen.getByLabelText(/e-post/i), { target: { value: "test@test.no" } });
    fireEvent.change(screen.getByLabelText(/^passord$/i), { target: { value: "passord123" } });
    fireEvent.change(screen.getByLabelText(/bekreft passord/i), { target: { value: "uliktPassord" } });

    fireEvent.click(screen.getByRole("button", { name: /lag ny bruker/i }));

    expect(await screen.findByText(/passordene stemmer ikke overens/i)).toBeInTheDocument();
  });

  test("kaller register og navigerer ved suksess", async () => {
    mockRegister.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/fullt navn/i), { target: { value: "Gyldig Navn" } });
    fireEvent.change(screen.getByLabelText(/e-post/i), { target: { value: "gyldig@test.no" } });
    fireEvent.change(screen.getByLabelText(/^passord$/i), { target: { value: "langtpassord123" } });
    fireEvent.change(screen.getByLabelText(/bekreft passord/i), { target: { value: "langtpassord123" } });

    fireEvent.click(screen.getByRole("button", { name: /lag ny bruker/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: "gyldig@test.no",
        fullName: "Gyldig Navn",
        password: "langtpassord123",
        role: "student",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/LogIn");
    });
  });
});
