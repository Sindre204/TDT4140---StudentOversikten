import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Companies } from "../src/pages/Companies";
import { fetchCompanies } from "../src/services/api";
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { MemoryRouter } from "react-router-dom";

vi.mock("../src/services/api");

const mockCompanies = [
  { id: 1, name: "BDO", industry: "Revisjon", description: "Vi leverer rådgivning." },
  { id: 2, name: "Abra", industry: "Teknologi", description: "Magiske løsninger." },
  { id: 3, name: "Zerya", industry: "Energi", description: "Fremtidens kraft." },
];

describe("Companies Component", () => {
  beforeEach(() => {
    vi.mocked(fetchCompanies).mockResolvedValue(mockCompanies);
  });

  test("rendrer overskrift og alle selskaper", async () => {
    render(
      <MemoryRouter>
        <Companies />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /Selskaper/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("BDO")).toBeInTheDocument();
      expect(screen.getByText("Abra")).toBeInTheDocument();
      expect(screen.getByText("Zerya")).toBeInTheDocument();
    });
  });

  test("søker etter selskaper basert på navn", async () => {
    render(
      <MemoryRouter>
        <Companies />
      </MemoryRouter > 
    );

    await waitFor(() => expect(screen.getByText("BDO")).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText(/Søk etter selskaper/i);
    fireEvent.change(searchInput, { target: { value: "Abra" } });

    expect(screen.getByText("Abra")).toBeInTheDocument();
    expect(screen.queryByText("BDO")).not.toBeInTheDocument();
  });

  test("sorterer selskaper alfabetisk (A-Å og Å-A)", async () => {
    render(
      <MemoryRouter>
        <Companies />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("BDO")).toBeInTheDocument());

    const sortSelect = screen.getByRole("combobox", { name: /sortering/i });

    // Sjekk A-Å (Standard eller valgt)
    fireEvent.change(sortSelect, { target: { value: "asc" } });
    let companyTitles = screen.getAllByRole("heading", { level: 2 });
    expect(companyTitles[0].textContent).toBe("Abra");
    expect(companyTitles[2].textContent).toBe("Zerya");

    // Sjekk Å-A
    fireEvent.change(sortSelect, { target: { value: "desc" } });
    companyTitles = screen.getAllByRole("heading", { level: 2 });
    expect(companyTitles[0].textContent).toBe("Zerya");
    expect(companyTitles[2].textContent).toBe("Abra");
  });

  test("filtrerer selskaper basert på bransje", async () => {
    render(
      <MemoryRouter>
        <Companies />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("BDO")).toBeInTheDocument());

    const industrySelect = screen.getByRole("combobox", { name: /bransje/i });
    fireEvent.change(industrySelect, { target: { value: "Teknologi" } });

    expect(screen.getByText("Abra")).toBeInTheDocument();
    expect(screen.queryByText("BDO")).not.toBeInTheDocument();
    expect(screen.queryByText("Zerya")).not.toBeInTheDocument();
  });
});