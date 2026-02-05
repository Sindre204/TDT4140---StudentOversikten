import "./ListingCard.css";

export function ListingCard({ listing }) {
  return (
    <div className="listing-card">
      <img src={listing.img} alt={listing.company} />
      
      <div className="content">
        <h3>{listing.company}</h3>
        <h2>{listing.title}</h2>
        
        <div className="details-row">
          <span className="location">{listing.location}</span>
          <span className="employment">{listing.employmentType}</span>
        </div>

        <p className="deadline">Søknadsfrist: {listing.applicationDeadline}</p>
      </div>

      <p className="description">{listing.description}</p>
    </div>
  );
}