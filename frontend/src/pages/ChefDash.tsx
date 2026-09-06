import { useEffect, useState } from "react";
import { api } from "../api";

interface Item {
  id: string;
  menuItem: { name: string; type: string };
  quantity: number;
  chefId: string | null;
}

interface Chef {
  id: string;
  name: string;
  specialty: string;
}

function ChefDash() {
  const [items, setItems] = useState<Item[]>([]);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [selected, setSelected] = useState<Record<string, string>>({}); // itemId -> chefId

  const load = () => {
    api.get("/orders").then((orders: any[]) => {
      const food: Item[] = [];
      orders.forEach((o) => {
        o.items.forEach((it: Item) => {
          if (it.menuItem.type === "Food") food.push({ ...it });
        });
      });
      setItems(food);
    });
    api.get("/chefs").then((c: Chef[]) => setChefs(c));
  };

  useEffect(load, []);

  const claim = async (itemId: string) => {
    const chefId = selected[itemId];
    if (!chefId) return;
    await api.patch(`/chefs/${chefId}/items/${itemId}`, {});
    load();
  };

  return (
    <div>
      <h1>Chef dashboard</h1>
      <p>Food items waiting to be prepared. Assign a chef to claim one.</p>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Chef</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td>{it.menuItem.name}</td>
              <td>{it.quantity}</td>
              <td>
                {it.chefId ? (
                  <span className="badge">Assigned</span>
                ) : (
                  <select
                    value={selected[it.id] || ""}
                    onChange={(e) =>
                      setSelected((s) => ({ ...s, [it.id]: e.target.value }))
                    }
                  >
                    <option value="">Select chef…</option>
                    {chefs.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.specialty})
                      </option>
                    ))}
                  </select>
                )}
              </td>
              <td>
                {!it.chefId && (
                  <button className="btn secondary" onClick={() => claim(it.id)}>
                    Claim
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <p>No food items to prepare right now.</p>}
    </div>
  );
}

export default ChefDash;
