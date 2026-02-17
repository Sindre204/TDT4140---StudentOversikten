import { render, screen } from "@testing-library/react";
import { Navbar } from "../src/components/Navbar";
import { useAuth } from "../src/context/AuthContext";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, test, expect, beforeEach } from "vitest";

vi.mock("../src/context/AuthContext");

// Deler av testene er generert med Google Gemini

describe("Navbar Component", () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("viser standardlenker (Home, Events, Listings)", () => {

        vi.mocked(useAuth).mockReturnValue({ user: null });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByRole("button", { name: /Home/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Events/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Listings/i })).toBeInTheDocument();
    });

    test("viser 'Log in' når brukeren ikke er logget inn", () => {
        vi.mocked(useAuth).mockReturnValue({ user: null });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByRole("button", { name: /Log in/i })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /My profile/i })).not.toBeInTheDocument();
    });

    test("viser 'My profile' når brukeren er logget inn", () => {
        vi.mocked(useAuth).mockReturnValue({ user: { name: "Test User" } });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByRole("button", { name: /My profile/i })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /Log in/i })).not.toBeInTheDocument();
    });

    test("viser Admin-knappen med riktig lenke", () => {
        vi.mocked(useAuth).mockReturnValue({ user: null });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const adminBtn = screen.getByRole("button", { name: /Admin/i });
        const adminLink = adminBtn.closest("a");
        
        expect(adminLink).toHaveAttribute("href", "http://127.0.0.1:8000/admin/");
    });
});