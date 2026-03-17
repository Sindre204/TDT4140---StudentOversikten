import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, test, expect, beforeEach } from "vitest";
import { Events } from "../src/pages/Events";
import { fetchEvents } from "../src/services/api";

import { vi, describe, test, expect, beforeEach } from 'vitest';
import { MemoryRouter } from "react-router-dom";

// Parts of the tests were generated with Google Gemini by Henrik C Kran



vi.mock("../src/services/api");

const mockEvents = [
  {
    id: 1,
    title: "Gokart med gjengen",
    description: "Vi kjører fort",
    category: "Sosialt",
    date: "2026-05-20",
  },
  {
    id: 2,
    title: "Fotballturnering",
    description: "Moro med ball",
    category: "Sports",
    date: "2026-04-10",
  },
  {
    id: 3,
    title: "React Kurs",
    description: "lær deg hooks",
    category: "Kurs",
    date: "2026-06-01",
  },
];

describe("Events Component", () => {
  beforeEach(() => {
    vi.mocked(fetchEvents).mockResolvedValue(mockEvents);
  });

  test("rendrer overskrift og laster alle events", async () => {
    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /arrangementer/i })).toBeInTheDocument();

    expect(await screen.findByText("Gokart med gjengen")).toBeInTheDocument();
    expect(screen.getByText("Fotballturnering")).toBeInTheDocument();
    expect(screen.getByText("React Kurs")).toBeInTheDocument();
  });

  test("filtrerer events basert på søkeord i tittel", async () => {
    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );

    await screen.findByText("Gokart med gjengen");

    fireEvent.change(screen.getByPlaceholderText(/søk etter arrangementer/i), {
      target: { value: "Gokart" },
    });

    expect(screen.getByText("Gokart med gjengen")).toBeInTheDocument();
    expect(screen.queryByText("Fotballturnering")).not.toBeInTheDocument();
  });

  test("filtrerer events basert på kategori", async () => {
    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );

    await screen.findByText("Fotballturnering");

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "Sports" } });

    expect(screen.getByText("Fotballturnering")).toBeInTheDocument();
    expect(screen.queryByText("Gokart med gjengen")).not.toBeInTheDocument();
    expect(screen.queryByText("React Kurs")).not.toBeInTheDocument();
  });

  test("sorterer events etter dato (nyeste først som standard)", async () => {
    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );

    await screen.findByText("React Kurs");

    const eventTitles = screen.getAllByRole("heading", { level: 2 });
    expect(eventTitles[0].textContent).toContain("React Kurs");
    expect(eventTitles[1].textContent).toContain("Gokart med gjengen");
  });
});
