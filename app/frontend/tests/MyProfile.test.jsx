import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LogIn } from "../src/pages/LogIn"; // Sjekk at denne stien stemmer
import { useAuth } from "../src/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { vi, describe, test, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";

// Parts of the tests were generated with Google Gemini by Henrik C Kran

vi.mock("../src/context/AuthContext");
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return { ...actual, useNavigate: vi.fn() };
});

describe("LogIn Component", () => {
    const mockLogin = vi.fn();
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);
        vi.mocked(useAuth).mockReturnValue({
            login: mockLogin,
            user: null
        });
    });

    test("oppdaterer input-felter når brukeren skriver", () => {
        render(
            <MemoryRouter>
                <LogIn />
            </MemoryRouter>
        );

        // ENDRING: Bruk getByLabelText i stedet for getByPlaceholderText
        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Password/i);

        fireEvent.change(emailInput, { target: { value: "test@bruker.no" } });
        fireEvent.change(passwordInput, { target: { value: "hemmelig123" } });

        expect(emailInput.value).toBe("test@bruker.no");
        expect(passwordInput.value).toBe("hemmelig123");
    });

    test("kaller login-funksjonen og navigerer ved suksessfull pålogging", async () => {
        mockLogin.mockResolvedValue({ email: "test@bruker.no", fullName: "Test Navn" });

        render(
            <MemoryRouter>
                <LogIn />
            </MemoryRouter>
        );

        // ENDRING: Bruk getByLabelText her også
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@bruker.no" } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "passord" } });
        
        const loginButton = screen.getByRole("button", { name: /Log In/i });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                email: "test@bruker.no",
                password: "passord"
            });
            expect(mockNavigate).toHaveBeenCalledWith("/MyProfile");
        });
    });
});