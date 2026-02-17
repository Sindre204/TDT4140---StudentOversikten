import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreateUser } from "../src/pages/CreateUser";
import { useAuth } from "../src/context/AuthContext";
import { useNavigate, MemoryRouter } from "react-router-dom";
import { vi, describe, test, expect, beforeEach } from "vitest";

// Deler av testene er generert med Google Gemini

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

        // VIKTIG: Fyll ut ALLE felt så HTML-valideringen slipper oss gjennom
        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "Test Bruker" } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@test.no" } });
        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "123" } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "123" } });

        fireEvent.click(screen.getByRole("button", { name: /Create New User/i }));

        // Nå vil React-koden din kjøre og sette setError
        const errorMsg = await screen.findByText(/Password must be at least 6 characters long/i);
        expect(errorMsg).toBeInTheDocument();
    });

    test("viser feilmelding hvis passordene ikke er like", async () => {
        render(
            <MemoryRouter>
                <CreateUser />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "Test Bruker" } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@test.no" } });
        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "passord123" } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "uliktPassord" } });

        fireEvent.click(screen.getByRole("button", { name: /Create New User/i }));

        const errorMsg = await screen.findByText(/Passwords do not match/i);
        expect(errorMsg).toBeInTheDocument();
    });

    test("kaller register og navigerer ved suksess", async () => {
        mockRegister.mockResolvedValueOnce({});

        render(
            <MemoryRouter>
                <CreateUser />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "Gyldig Navn" } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "gyldig@test.no" } });
        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "langtpassord123" } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "langtpassord123" } });

        fireEvent.click(screen.getByRole("button", { name: /Create New User/i }));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/LogIn");
        });
    });
});