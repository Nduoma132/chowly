import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api";

interface MenuItem {
  id: string;
  name: string;
  type: string;
  price: number;
}

interface Restaurant {
  id: string;
  name: string;
  menuItems: MenuItem[];
}

interface Waiter {
  id: string;
  name: string;
}

function Order() {
  const { restaurantId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({}); // menuItemId -> qty
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [waiterId, setWaiterId] = useState("");
  const [restName, setRestName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // load restaurant + menu + waiters
  useEffect(() => {
    if (!restaurantId) return;
    api
      .get(`/restaurants/${restaurantId}`)
      .then((r: Restaurant) => {
        setMenu(r.menuItems);
        setRestName(r.name);
      })
      .catch(() => setError("Could not load the menu."));
    api.get("/waiters").then((ws: Waiter[]) => {
      setWaiters(ws);
      if (ws.length) setWaiterId(ws[0].id);
    });
  }, [restaurantId]);

  // pre-load the item from the ?item= query param
  useEffect(() => {
    const itemId = params.get("item");
    if (itemId) {
      setCart((c) => ({ ...c, [itemId]: 1 }));
    }
  }, [params]);

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const remove = (id: string) =>
    setCart((c) => {
      const next = { ...c };
      if ((next[id] || 0) <= 1) delete next[id];
      else next[id]--;
      return next;
    });

  const selectedItems = menu.filter((m) => cart[m.id]);
  const total = selectedItems.reduce((sum, m) => sum + m.price * cart[m.id], 0);

  const placeOrder = async () => {
    if (!name || !phone) {
      setError("Please enter your name and phone number.");
      return;
    }
    if (selectedItems.length === 0) {
      setError("Add at least one item to your order.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      // create or reuse customer
      let customerId: string;
      const existing = await api.get(`/customers`);
      const match = existing.find(
        (c: any) => c.email.toLowerCase() === email.toLowerCase()
      );
      if (match) customerId = match.id;
      else {
        const created = await api.post("/customers", { name, phoneNumber: phone, email });
        customerId = created.id;
      }

      // waiters currently include all restaurants; assign first available waiter
      const assignedWaiter = waiterId || waiters[0]?.id;

      const order = await api.post("/orders", {
        customerId,
        waiterId: assignedWaiter,
        items: selectedItems.map((m) => ({ menuItemId: m.id, quantity: cart[m.id] })),
      });

      navigate(`/pay/${order.id}`);
    } catch (e: any) {
      setError(e.message || "Could not place the order.");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Place your order at {restName}</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <h2>Menu</h2>
      {menu.map((m) => (
        <div className="row" key={m.id}>
          <div>
            <strong>{m.name}</strong>
            <span style={{ marginLeft: 8, color: "#777" }}>
              {m.type} · ₦{m.price}
            </span>
          </div>
          <div>
            {cart[m.id] ? (
              <>
                <button className="qty-btn" onClick={() => remove(m.id)}>−</button>
                <span style={{ margin: "0 10px" }}>{cart[m.id]}</span>
                <button className="qty-btn" onClick={() => add(m.id)}>+</button>
              </>
            ) : (
              <button className="btn secondary" onClick={() => add(m.id)}>Add</button>
            )}
          </div>
        </div>
      ))}

      <h2>Your order</h2>
      {selectedItems.length === 0 ? (
        <p style={{ color: "#888" }}>No items yet.</p>
      ) : (
        selectedItems.map((m) => (
          <div className="row" key={m.id}>
            <span>{m.name} × {cart[m.id]}</span>
            <span>₦{m.price * cart[m.id]}</span>
          </div>
        ))
      )}
      <div className="row">
        <strong>Total</strong>
        <strong>₦{total}</strong>
      </div>

      <h2>Your details</h2>
      <label>Name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ada Johnson" />
      <label>Phone number</label>
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0811222333" />
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />

      <button className="btn" onClick={placeOrder} disabled={submitting}>
        {submitting ? "Placing…" : "Place order"}
      </button>
    </div>
  );
}

export default Order;
