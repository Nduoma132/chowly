import { useEffect, useState } from "react";
import { api } from "../api";

interface OrderRow {
  id: string;
  status: string;
  waitingTime: number | null;
  customer: { name: string };
  waiter: { name: string };
  items: {
    id: string;
    quantity: number;
    menuItem: { name: string; type: string; price: number };
    chef: { name: string } | null;
    bartender: { name: string } | null;
  }[];
}

interface Staff {
  id: string;
  name: string;
  specialty?: string;
}

function WaiterHome() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [chefs, setChefs] = useState<Staff[]>([]);
  const [bartenders, setBartenders] = useState<Staff[]>([]);
  const [picks, setPicks] = useState<Record<string, { chefId?: string; bartenderId?: string }>>({});
  const [msg, setMsg] = useState("");

  const load = () => {
    api.get("/orders").then((o: OrderRow[]) =>
      setOrders(o.filter((x) => x.status !== "Completed"))
    );
    api.get("/chefs").then(setChefs);
    api.get("/bartenders").then(setBartenders);
  };

  useEffect(load, []);

  const markServed = async (orderId: string) => {
    const pick = picks[orderId] || {};
    await api.patch(`/orders/${orderId}`, {
      chefId: pick.chefId,
      bartenderId: pick.bartenderId,
      status: "Served",
    });
    setMsg(`Order marked as Served ✅`);
    load();
  };

  return (
    <div>
      <h1>Waiter dashboard</h1>
      <p>Open an order, record which chef and bartender prepared it, then mark it served.</p>
      {msg && <p style={{ color: "green" }}>{msg}</p>}

      {orders.length === 0 && <p>No open orders right now.</p>}

      {orders.map((o) => (
        <div className="card" key={o.id} style={{ marginBottom: 16 }}>
          <div className="row">
            <div>
              <strong>Order · {o.customer.name}</strong>
              <span className="badge" style={{ marginLeft: 8 }}>{o.status}</span>
              <span style={{ marginLeft: 8, color: "#777" }}>
                est. wait {o.waitingTime} min
              </span>
            </div>
          </div>

          <h3 style={{ marginBottom: 4 }}>Items</h3>
          {o.items.map((i) => (
            <div className="row" key={i.id}>
              <span>
                {i.menuItem.name} × {i.quantity} <span style={{ color: "#777" }}>({i.menuItem.type})</span>
              </span>
              <span style={{ fontSize: 13, color: "#888" }}>
                {i.chef?.name || i.bartender?.name || "unassigned"}
              </span>
            </div>
          ))}

          <h3 style={{ marginBottom: 4 }}>Assign kitchen staff</h3>
          <div className="row">
            <div style={{ width: "48%" }}>
              <label style={{ fontWeight: 600, fontSize: 13 }}>Chef (food)</label>
              <select
                value={picks[o.id]?.chefId || ""}
                onChange={(e) =>
                  setPicks((p) => ({ ...p, [o.id]: { ...p[o.id], chefId: e.target.value } }))
                }
              >
                <option value="">Select chef…</option>
                {chefs.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div style={{ width: "48%" }}>
              <label style={{ fontWeight: 600, fontSize: 13 }}>Bartender (drinks)</label>
              <select
                value={picks[o.id]?.bartenderId || ""}
                onChange={(e) =>
                  setPicks((p) => ({ ...p, [o.id]: { ...p[o.id], bartenderId: e.target.value } }))
                }
              >
                <option value="">Select bartender…</option>
                {bartenders.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: 10, textAlign: "right" }}>
            <button className="btn" onClick={() => markServed(o.id)}>
              Mark as served
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WaiterHome;
