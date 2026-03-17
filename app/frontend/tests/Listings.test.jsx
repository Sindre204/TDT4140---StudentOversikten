import { MemoryRouter } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach } from "vitest";
import { Listings } from "../src/pages/Listings";
import { fetchAds } from "../src/services/api";

import { vi, describe, test, expect, beforeEach } from 'vitest';

// Parts of the tests were generated with Google Gemini by Henrik C Kran



vi.mock("../src/services/api");

const mockData = [
  { id: 1, title: "Frontend Utvikler", city: "Oslo", applicationDeadline: "2024-12-01" },
  { id: 2, title: "Backend Utvikler", city: "Trondheim", applicationDeadline: "2024-11-01" },
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

    expect(screen.getByRole("heading", { name: /jobbannonser/i })).toBeInTheDocument();

    expect(await screen.findByText("Frontend Utvikler")).toBeInTheDocument();
    expect(screen.getByText("Backend Utvikler")).toBeInTheDocument();
  });

  test("filtrerer annonser basert på søk", async () => {
    render(
      <MemoryRouter>
        <Listings />
      </MemoryRouter>
    );

    await screen.findByText("Frontend Utvikler");

    fireEvent.change(screen.getByPlaceholderText(/søk etter jobbannonser/i), {
      target: { value: "Frontend" },
    });

    expect(screen.getByText("Frontend Utvikler")).toBeInTheDocument();
    expect(screen.queryByText("Backend Utvikler")).not.toBeInTheDocument();
  });

  test("filtrerer annonser basert på by", async () => {
    render(
      <MemoryRouter>
        <Listings />
      </MemoryRouter>
    );

    await screen.findByText("Frontend Utvikler");

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "Oslo" } });

    expect(screen.getByText("Frontend Utvikler")).toBeInTheDocument();
    expect(screen.queryByText("Backend Utvikler")).not.toBeInTheDocument();
  });
});
