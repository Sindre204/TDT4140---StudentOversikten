import { useParams } from 'react-router-dom';

export function ListingDetail() {
  const { company } = useParams();

  return (
    <div>
      <h1>{company}</h1>
      <p>Her kan du vise mer info om stillingen for {company}</p>
    </div>
  );
}
