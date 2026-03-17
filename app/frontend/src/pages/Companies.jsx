import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CompanyCard } from "../components/CompanyCard";
import { fetchCompanies } from "../services/api";

export function Companies() {
  const { t } = useTranslation();
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
          return (company.name || "").toLowerCase().includes(query);
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
      <h1 className="events-header">{t("companiesTitle")}</h1>

      <p className="events-subtitle">{t("exploreCompanies")}</p>

      <div className="events-controls">
        <input
          type="text"
          aria-label={t("searchCompanies")}
          placeholder={t("searchCompanies")}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          aria-label={t("sortOrder")}
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
        >
          <option value="asc">{t("sortAsc")}</option>
          <option value="desc">{t("sortDesc")}</option>
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
