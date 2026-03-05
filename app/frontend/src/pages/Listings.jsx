import { useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import { ListingCard } from "../components/LisitingCard";
import { fetchAds } from "../services/api";

export function Listings() {
  const {t} = useTranslation();
  const [listings, setListings] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAds().then(data => setListings(data));
  }, []);

  const cities = [
    "All",
    ...new Set(listings.map(l => l.city))
  ];

  const filteredListings = listings
    .filter(listing => {
      const matchesCity =
        selectedCity === "All" || listing.city === selectedCity;

      const matchesSearch =
        listing.title?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCity && matchesSearch;
    })
    .sort((a, b) => {
      return sortOrder === "newest"
        ? new Date(b.applicationDeadline) - new Date(a.applicationDeadline)
        : new Date(a.applicationDeadline) - new Date(b.applicationDeadline);
    });

  return (
    <>
      <h1 className="Listings-header"> {t("jobListings")} </h1>

      <p className="listings-subtitle">
        {t("exploreListings")}
      </p>

      <div className="listings-controls">
        <input
          type="text"
          placeholder = {t("searchListings")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {cities.map(city => (
            <option key={city} value={city}>
              {city === "All" ? t("allCities") : city}
            </option>
          ))}
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">{t("newestFirst")}</option>
          <option value="oldest">{t("oldestFirst")}</option>
        </select>
      </div>

      <div className="listing-grid">
        {filteredListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </>
  );
}
