import { EventCard } from "../components/EventCard";

import summerEventImg from "../assets/events/summerEventImg.jpg";

export function Events(){

    const events = [
        {
            title: "Vinterball",
            date: "2026-03-15",
            places: "80/100",
            location: "Studenthuset",
            img: summerEventImg
        },
        {
            title: "Påskefest",
            date: "2026-03-22",
            places: "50/60",
            location: "Campus Lounge",
            img: summerEventImg
        },
        {
            title: "Sommeravslutning",
            date: "2026-06-05",
            places: "120/150",
            location: "Bakgården",
            img: summerEventImg
        },
        {
            title: "Halloween Party",
            date: "2026-10-31",
            places: "200/250",
            location: "Klubb Arena",
            img: summerEventImg
        }
        ];




    return (
        <>

            <h1> Events </h1>

            <div className="events-grid">
                {events.map((event, index) => (
                    <EventCard key={index} event={event} />
                ))}
            </div>
        
        
        </>

    )

}