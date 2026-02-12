import "./Home.css";
export function Home() {
  return (
    <div className="home">
      <h1>Velkommen til StudentOversikten</h1>

      <p className="intro">
        Alt du trenger som student – samlet på ett sted.
      </p>

      <div className="info-box">
        <p>
          Her finner du en oversikt over arrangementer og jobbannonser
          som er relevante for deg som student.
        </p>
        <p>
          Bruk menyen øverst for å utforske hva som skjer,
          eller finn din neste deltidsjobb.
        </p>
      </div>


    </div>
  );
}