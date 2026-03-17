import { render, screen } from "@testing-library/react";
import { Navbar } from "../src/components/Navbar";
import { useAuth } from "../src/context/AuthContext";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, test, expect, beforeEach } from "vitest";

vi.mock("../src/context/AuthContext");

// Parts of the tests were generated with Google Gemini by Henrik C Kran

describe("Navbar Component", () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("viser standardlenker (Hjem, Arrangementer, Jobbannonser)", () => {

        vi.mocked(useAuth).mockReturnValue({ user: null });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByRole("button", { name: /Hjem/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Arrangementer/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Jobbannonser/i })).toBeInTheDocument();
    });

    test("viser 'Logg inn' når brukeren ikke er logget inn", () => {
        vi.mocked(useAuth).mockReturnValue({ user: null });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByRole("button", { name: /Logg inn/i })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /Min profil/i })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /Administrasjon/i })).not.toBeInTheDocument();
    });

    test("viser 'Min profil' når brukeren er logget inn", () => {
        vi.mocked(useAuth).mockReturnValue({ user: { name: "Test User" } });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByRole("button", { name: /Min profil/i })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /Logg inn/i })).not.toBeInTheDocument();
    });

    test("viser administrasjonsknappen med riktig lenke for bedrift", () => {
        vi.mocked(useAuth).mockReturnValue({ user: { role: "company" } });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const adminBtn = screen.getByRole("button", { name: /Administrasjon/i });
        const adminLink = adminBtn.closest("a");
        
        expect(adminLink).toHaveAttribute("href", "/administration");
    });

    test("viser django-admin-knappen med riktig lenke for admin", () => {
        vi.mocked(useAuth).mockReturnValue({ user: { role: "admin" } });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const adminBtn = screen.getByRole("button", { name: /^Admin$/i });
        const adminLink = adminBtn.closest("a");

        expect(adminLink).toHaveAttribute("href", "http://127.0.0.1:8000/admin/");
        expect(screen.queryByRole("button", { name: /Administrasjon/i })).not.toBeInTheDocument();
    });
}); 
