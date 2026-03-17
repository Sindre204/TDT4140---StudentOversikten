import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LogIn } from "../src/pages/LogIn";
import { useAuth } from "../src/context/AuthContext";
import { useNavigate, MemoryRouter } from "react-router-dom";
import { vi, describe, test, expect, beforeEach } from "vitest";

// Parts of the tests were generated with Google Gemini by Henrik C Kran


vi.mock("../src/context/AuthContext");
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

describe("LogIn Component", () => {
    const mockLogin = vi.fn();
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);
        vi.mocked(useAuth).mockReturnValue({
            login: mockLogin,
        });
    });

    test("oppdaterer input-felter når brukeren skriver", () => {
        render(
            <MemoryRouter>
                <LogIn />
            </MemoryRouter>
        );

        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Password/i);

        fireEvent.change(emailInput, { target: { value: "bruker@test.no" } });
        fireEvent.change(passwordInput, { target: { value: "passord123" } });

        expect(emailInput.value).toBe("bruker@test.no");
        expect(passwordInput.value).toBe("passord123");
    });

    test("navigerer til /MyProfile ved suksessfull innlogging", async () => {
        mockLogin.mockResolvedValueOnce({}); 

        render(
            <MemoryRouter>
                <LogIn />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@test.no" } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "123" } });
        
        fireEvent.click(screen.getByRole("button", { name: /Log In/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                email: "test@test.no",
                password: "123"
            });
            expect(mockNavigate).toHaveBeenCalledWith("/MyProfile");
        });
    });

    test("viser feilmelding hvis innlogging feiler", async () => {
        mockLogin.mockRejectedValue({ message: "Invalid email or password" });

        render(
            <MemoryRouter>
                <LogIn />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "feil@bruker.no" } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "feilpassord" } });

        
        const loginButton = screen.getByRole("button", { name: /Log In/i });
        fireEvent.click(loginButton);


        const errorMessage = await screen.findByText((content, element) => {
            return element.tagName.toLowerCase() === 'p' && content.includes("Invalid email or password");
        });

        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveClass("error-message");
    });
});