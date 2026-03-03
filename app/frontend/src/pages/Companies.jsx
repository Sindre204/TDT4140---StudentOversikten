import { useEffect, useMemo, useState } from "react";
import { CompanyCard } from "../components/CompanyCard";
import { fetchCompanies } from "../services/api";

export function Companies() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchCompanies().then((data) => setCompanies(data));
  }, []);

  const visibleCompanies = useMemo(
    () =>
      companies
        .filter((company) => {
          const query = searchTerm.toLowerCase();
          const matchesSearch = (company.name || "").toLowerCase().includes(query);

          return matchesSearch;
        })
        .sort((a, b) => {
          if (sortOrder === "desc") {
            return (b.name || "").localeCompare(a.name || "", "no");
          }
          return (a.name || "").localeCompare(b.name || "", "no");
        }),
    [companies, searchTerm, sortOrder]
  );

  return (
    <>
      <h1 className="events-header">Selskaper</h1>

      <p className="events-subtitle">
        Utforsk alle firmaer vi samarbeider med
      </p>

      <div className="events-controls">
        <input
          type="text"
          aria-label="Søk"
          placeholder="Søk etter selskaper"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          aria-label="Sortering"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
        >
          <option value="asc">A-Å</option>
          <option value="desc">Å-A</option>
        </select>
      </div>

      <div className="companies-grid">
        {visibleCompanies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </>
  );
}
