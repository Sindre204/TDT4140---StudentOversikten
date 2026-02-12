import { useEffect, useState } from "react";
import { ListingCard } from "../components/LisitingCard";
import { fetchAds } from "../services/api";

export function Listings() {
  const [listings, setListings] = useState([]);
    const [filter, setFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("newest");
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
        fetchAds().then(data => setListings(data));
    }, []);


    const filteredListings = listings.filter(listing => {
        const matchesLocation = filter === "All" || listing.location === filter;

        const matchesSearch = listing.title?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesLocation && matchesSearch;
    })

    .sort((a, b) => {
        return sortOrder === "newest"
            ? new Date(b.applicationDeadline) - new Date(a.applicationDeadline)
            : new Date(a.applicationDeadline) - new Date(b.applicationDeadline);
    });




    return (
        <>

            <h1 className="Listings-header"> Jobbannonser </h1>

            <p className="listings-subtitle">
                Utforsk relevante jobbannonser
            </p>


            <div className="listings-controls">
            <input type="text" 
                placeholder="Søk etter jobbannonser" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                />


            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="All">Alle kategorier</option>
                <option value="Oslo">Oslo</option>
                <option value="Trondheim">Trondheim</option>
                
            </select>

            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="newest">Nyeste først</option>
                <option value="oldest">Eldste først</option>
            </select>
            </div>


            <div className="listing-grid">
                {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
                ))}
            </div>
        </>

    );

}

