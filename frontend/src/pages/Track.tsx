import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";

interface Order {
  id: string;
  status: string;
  waitingTime: number | null;
  orderTime: string;
  items: { menuItem: { name: string }; quantity: number }[];
  payment: { amount: number; method: string; status: string } | null;
}

function Track() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(3);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get("/orders").then((orders: Order[]) => {
      const found = orders.find((o) => o.id === orderId);
      if (found) setOrder(found);
      else setError("Order not found.");
    });
  }, [orderId]);

  const submitComplaint = async () => {
    setSending(true);
    try {
      await api.post("/complaints", {
        orderId,
        description,
        rating: Number(rating),
      });
      setSent(true);
      setSending(false);
    } catch {
      setError("Could not submit your complaint.");
      setSending(false);
    }
  };

  if (error) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!order) return <p>Loading…</p>;

  return (
    <div>
      <h1>Track your order</h1>
      <div className="card">
        <p>
          Status: <span className="badge">{order.status}</span>
        </p>
        {order.waitingTime != null && <p>Estimated wait: {order.waitingTime} minutes</p>}
        <p>
          Ordered: {new Date(order.orderTime).toLocaleString()}
        </p>
        <ul>
          {order.items.map((i, idx) => (
            <li key={idx}>
              {i.menuItem.name} × {i.quantity}
            </li>
          ))}
        </ul>
        {order.payment && (
          <p>
            Paid <strong>₦{order.payment.amount}</strong> via {order.payment.method} (
            {order.payment.status})
          </p>
        )}
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {sent ? (
        <p style={{ color: "green" }}>✅ Thank you! Your feedback was submitted.</p>
      ) : (
        <>
          <h2>Leave feedback (only if there was an issue)</h2>
          <label>Rating (1–5)</label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <label>Describe the problem</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Food was cold on arrival"
          />
          <button className="btn" onClick={submitComplaint} disabled={sending}>
            {sending ? "Submitting…" : "Submit complaint"}
          </button>
        </>
      )}

      <p style={{ marginTop: 20 }}>
        <Link to="/">Back to restaurants</Link>
      </p>
    </div>
  );
}

export default Track;
