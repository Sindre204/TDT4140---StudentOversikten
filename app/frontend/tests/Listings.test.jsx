import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Listings } from "../src/pages/Listings";
import { fetchAds } from "../src/services/api";
import { vi, describe, test, expect, beforeEach } from 'vitest';

// Deler av testene er generert med Google Gemini

vi.mock("../src/services/api");

const mockData = [
  { id: 1, title: "Frontend Utvikler", location: "Oslo", applicationDeadline: "2024-12-01" },
  { id: 2, title: "Backend Utvikler", location: "Trondheim", applicationDeadline: "2024-11-01" },
];

describe("Listings Component", () => {
  beforeEach(() => {
    vi.mocked(fetchAds).mockResolvedValue(mockData);
  });

  test("rendrer overskrift og alle annonser ved oppstart", async () => {
    render(
      <MemoryRouter>
        <Listings />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /Jobbannonser/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Frontend Utvikler")).toBeInTheDocument();
      expect(screen.getByText("Backend Utvikler")).toBeInTheDocument();
    });
  });

  test("verifiserer at søkefeltet oppdateres, men at alle annonser forblir synlige", async () => {
    render(
      <MemoryRouter>
        <Listings />
      </MemoryRouter>
    );
    
    await waitFor(() => expect(screen.getByText("Frontend Utvikler")).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText(/Søk etter jobbannonser/i);
    
    
    fireEvent.change(searchInput, { target: { value: "Frontend" } });

    
    expect(screen.getByText("Frontend Utvikler")).toBeInTheDocument();
    expect(screen.getByText("Backend Utvikler")).toBeInTheDocument(); 
  });

  test("verifiserer at lokasjonsfilter ikke skjuler elementer", async () => {
    render(
      <MemoryRouter>
        <Listings />
      </MemoryRouter>
    );
    
    await waitFor(() => expect(screen.getByText("Frontend Utvikler")).toBeInTheDocument());

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "Oslo" } });

    
    expect(screen.getByText("Frontend Utvikler")).toBeInTheDocument();
    expect(screen.getByText("Backend Utvikler")).toBeInTheDocument(); 
  });
});