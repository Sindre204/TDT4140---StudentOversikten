import { useState } from "react";
import { ListingCard } from "../components/ListingCard";

import bankImg from "../assets/listings/Norges_bank_logo.png";


export function Listings(){

    const listings = [
    {
        title: "AI-utvikler",
        description: "Utvikle og implementere AI-løsninger for analyse og automatisering",
        company: "Norges Bank",
        location: "Oslo",
        employmentType: "Fast stilling",
        applicationDeadline: "2026-03-15",
        img : bankImg
    },

    {
        title: "Data Scientist",
        description: "Analysere store datasett og bygge prediktive modeller",
        company: "DNB",
        location: "Oslo",
        employmentType: "Fast stilling",
        applicationDeadline: "2026-03-20",
        img : bankImg
    },
    {
        title: "Maskinlæringsingeniør",
        description: "Utvikle og optimalisere maskinlæringsmodeller i produksjon",
        company: "Telenor",
        location: "Trondheim",
        employmentType: "Fast stilling",
        applicationDeadline: "2026-03-25", 
        img : bankImg
    },
    {
        title: "AI Engineer",
        description: "Designe og implementere AI-baserte systemer for interne verktøy",
        company: "Schibsted",
        location: "Oslo",
        employmentType: "Fast stilling",
        applicationDeadline: "2026-03-30", 
        img : bankImg
    }

    ]

    return (
        <>

            <h1 className="Listings-header"> Jobbannonser </h1>

            <p className="listings-subtitle">
                Utforsk relevante jobbannonser
            </p>


            <div className="listing-grid">
                {listings.map((listing, index) => (
                    <ListingCard key={index} listing={listing} />
                ))}
            </div>

        
        
        </>

    )

}