import { useEffect, useState } from "react";
import { api } from "../api";

interface Restaurant {
  id: string;
  name: string;
}

interface Complaint {
  id: string;
  description: string;
  rating: number;
  complaintTime: string;
}

function Admin() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [msg, setMsg] = useState("");

  // restaurant form
  const [rName, setRName] = useState("");
  const [rAddr, setRAddr] = useState("");
  const [rPhone, setRPhone] = useState("");

  // menu item form
  const [restId, setRestId] = useState("");
  const [mName, setMName] = useState("");
  const [mType, setMType] = useState("Food");
  const [mPrice, setMPrice] = useState("");

  // waiter form
  const [wRestId, setWRestId] = useState("");
  const [wName, setWName] = useState("");

  const load = () => {
    api.get("/restaurants").then(setRestaurants);
    api.get("/complaints").then(setComplaints);
  };

  useEffect(() => {
    load();
  }, []);

  const addRestaurant = async () => {
    await api.post("/restaurants", { name: rName, address: rAddr, contactNumber: rPhone });
    setMsg("Restaurant added ✅");
    setRName(""); setRAddr(""); setRPhone("");
    load();
  };

  const addMenuItem = async () => {
    await api.post("/menu-items", {
      restaurantId: restId,
      name: mName,
      type: mType,
      price: Number(mPrice),
    });
    setMsg("Menu item added ✅");
    setMName(""); setMPrice("");
    load();
  };

  const addWaiter = async () => {
    await api.post("/waiters", { restaurantId: wRestId, name: wName });
    setMsg("Waiter added ✅");
    setWName("");
  };

  return (
    <div>
      <h1>Admin</h1>
      {msg && <p style={{ color: "green" }}>{msg}</p>}

      <h2>Add a restaurant</h2>
      <label>Name</label>
      <input value={rName} onChange={(e) => setRName(e.target.value)} />
      <label>Address</label>
      <input value={rAddr} onChange={(e) => setRAddr(e.target.value)} />
      <label>Contact number</label>
      <input value={rPhone} onChange={(e) => setRPhone(e.target.value)} />
      <div style={{ marginTop: 10 }}>
        <button className="btn" onClick={addRestaurant}>Add restaurant</button>
      </div>

      <h2>Add a menu item</h2>
      <label>Restaurant</label>
      <select value={restId} onChange={(e) => setRestId(e.target.value)}>
        <option value="">Select restaurant…</option>
        {restaurants.map((r) => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>
      <label>Item name</label>
      <input value={mName} onChange={(e) => setMName(e.target.value)} />
      <label>Type</label>
      <select value={mType} onChange={(e) => setMType(e.target.value)}>
        <option>Food</option>
        <option>Drink</option>
      </select>
      <label>Price (₦)</label>
      <input value={mPrice} onChange={(e) => setMPrice(e.target.value)} type="number" />
      <div style={{ marginTop: 10 }}>
        <button className="btn" onClick={addMenuItem}>Add menu item</button>
      </div>

      <h2>Add a waiter</h2>
      <label>Restaurant</label>
      <select value={wRestId} onChange={(e) => setWRestId(e.target.value)}>
        <option value="">Select restaurant…</option>
        {restaurants.map((r) => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>
      <label>Waiter name</label>
      <input value={wName} onChange={(e) => setWName(e.target.value)} />
      <div style={{ marginTop: 10 }}>
        <button className="btn" onClick={addWaiter}>Add waiter</button>
      </div>

      <h2>Complaints</h2>
      {complaints.length === 0 ? (
        <p style={{ color: "#888" }}>No complaints yet. 🙂</p>
      ) : (
        complaints.map((c) => (
          <div className="card" key={c.id} style={{ marginBottom: 10 }}>
            <p>
              <span className="badge">★ {c.rating}/5</span>{" "}
              {new Date(c.complaintTime).toLocaleString()}
            </p>
            <p>{c.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Admin;
