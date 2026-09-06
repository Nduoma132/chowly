import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";

interface MenuItem {
  id: string;
  name: string;
  type: string; // Food or Drink
  price: number;
}

interface Restaurant {
  id: string;
  name: string;
  address: string;
  menuItems: MenuItem[];
}

function RestaurantMenu() {
  const { id } = useParams();
  const [rest, setRest] = useState<Restaurant | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/restaurants/${id}`)
      .then(setRest)
      .catch(() => setError("Could not load this restaurant."));
  }, [id]);

  if (error) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!rest) return <p>Loading…</p>;

  const food = rest.menuItems.filter((m) => m.type === "Food");
  const drink = rest.menuItems.filter((m) => m.type === "Drink");

  const renderList = (items: MenuItem[]) => (
    <div>
      {items.map((m) => (
        <div className="row" key={m.id}>
          <div>
            <strong>{m.name}</strong>
            <span style={{ marginLeft: 8, color: "#777" }}>₦{m.price}</span>
          </div>
          <Link className="btn secondary" to={`/order/${rest.id}?item=${m.id}`}>
            Add to order
          </Link>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <h1>{rest.name}</h1>
      <p style={{ color: "#777" }}>{rest.address}</p>

      <h2>🍽️ Food</h2>
      {renderList(food)}

      <h2>🥤 Drinks</h2>
      {renderList(drink)}

      <p style={{ marginTop: 24 }}>
        <Link className="btn" to={`/order/${rest.id}`}>Start an order</Link>
      </p>
    </div>
  );
}

export default RestaurantMenu;
