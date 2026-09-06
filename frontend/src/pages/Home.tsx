import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

interface Restaurant {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
}

function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/restaurants")
      .then(setRestaurants)
      .catch(() => setError("Could not load restaurants. Is the backend running?"));
  }, []);

  return (
    <div>
      <h1>Find a place to dine</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <div className="grid">
        {restaurants.map((r) => (
          <div className="card" key={r.id}>
            <h3>{r.name}</h3>
            <p>{r.address}</p>
            <p>{r.contactNumber}</p>
            <Link className="btn" to={`/restaurants/${r.id}`}>View menu</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
