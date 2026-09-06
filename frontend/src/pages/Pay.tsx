import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";

interface Order {
  id: string;
  status: string;
  items: {
    menuItem: { name: string; price: number };
    quantity: number;
  }[];
}

function Pay() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [method, setMethod] = useState("Card");
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/orders").then((orders: Order[]) => {
      const found = orders.find((o) => o.id === orderId);
      if (found) setOrder(found);
      else setError("Order not found.");
    });
  }, [orderId]);

  const total = order
    ? order.items.reduce((s, i) => s + i.menuItem.price * i.quantity, 0)
    : 0;

  const pay = async () => {
    setPaying(true);
    setError("");
    try {
      await api.post("/payments", { orderId, method, status: "Completed" });
      setDone(true);
    } catch (e: any) {
      setError(e.message || "Payment failed.");
      setPaying(false);
    }
  };

  if (done) {
    return (
      <div>
        <h1>✅ Payment successful</h1>
        <p>Your payment of ₦{total} was completed via {method}.</p>
        <p style={{ color: "#888", fontSize: 14 }}>
          ⚠️ Pretend payment — no real money was charged.
        </p>
        <Link className="btn" to={`/track/${orderId}`}>Track your order</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Checkout</h1>
      <p style={{ color: "#888", fontSize: 14 }}>
        ⚠️ This is a <strong>pretend payment</strong> for the demo — no real money is charged.
      </p>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <h2>Order summary</h2>
      {order?.items.map((i, idx) => (
        <div className="row" key={idx}>
          <span>{i.menuItem.name} × {i.quantity}</span>
          <span>₦{i.menuItem.price * i.quantity}</span>
        </div>
      ))}
      <div className="row">
        <strong>Total</strong>
        <strong>₦{total}</strong>
      </div>

      <h2>Payment method</h2>
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option>Card</option>
        <option>Cash</option>
        <option>Transfer</option>
        <option>Wallet</option>
      </select>

      <div style={{ marginTop: 16 }}>
        <button className="btn" onClick={pay} disabled={paying}>
          {paying ? "Processing…" : `Pay ₦${total}`}
        </button>
      </div>
    </div>
  );
}

export default Pay;
