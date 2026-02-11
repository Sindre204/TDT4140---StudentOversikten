import { useEffect, useState } from "react";
import { ListingCard } from "../components/LisitingCard";
import { fetchAds } from "../services/api";

export function Listings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetchAds().then((data) => setListings(data));
  }, []);

  return (
    <>
      <h1 className="Listings-header">Jobbannonser</h1>

      <p className="listings-subtitle">
        Utforsk relevante jobbannonser
      </p>

      <div className="listing-grid">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </>
  );
}
