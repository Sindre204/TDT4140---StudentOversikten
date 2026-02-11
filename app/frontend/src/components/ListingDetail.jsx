import { useParams } from 'react-router-dom';

export function ListingDetail() {
  const { id } = useParams();

  return (
    <div>
      <h1>Listing {id}</h1>
      <p>Her kan du vise mer info om stillingen med ID {id}</p>
    </div>
  );
}
