import { useEffect, useState } from "react";
import { api } from "../api";

interface Item {
  id: string;
  menuItem: { name: string; type: string };
  quantity: number;
  bartenderId: string | null;
}

interface Bartender {
  id: string;
  name: string;
}

function BartenderDash() {
  const [items, setItems] = useState<Item[]>([]);
  const [bartenders, setBartenders] = useState<Bartender[]>([]);
  const [selected, setSelected] = useState<Record<string, string>>({});

  const load = () => {
    api.get("/orders").then((orders: any[]) => {
      const drinks: Item[] = [];
      orders.forEach((o) => {
        o.items.forEach((it: Item) => {
          if (it.menuItem.type === "Drink") drinks.push({ ...it });
        });
      });
      setItems(drinks);
    });
    api.get("/bartenders").then((b: Bartender[]) => setBartenders(b));
  };

  useEffect(load, []);

  const claim = async (itemId: string) => {
    const bartenderId = selected[itemId];
    if (!bartenderId) return;
    await api.patch(`/bartenders/${bartenderId}/items/${itemId}`, {});
    load();
  };

  return (
    <div>
      <h1>Bartender dashboard</h1>
      <p>Drink items waiting to be prepared.</p>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Bartender</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td>{it.menuItem.name}</td>
              <td>{it.quantity}</td>
              <td>
                {it.bartenderId ? (
                  <span className="badge">Assigned</span>
                ) : (
                  <select
                    value={selected[it.id] || ""}
                    onChange={(e) =>
                      setSelected((s) => ({ ...s, [it.id]: e.target.value }))
                    }
                  >
                    <option value="">Select bartender…</option>
                    {bartenders.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                )}
              </td>
              <td>
                {!it.bartenderId && (
                  <button className="btn secondary" onClick={() => claim(it.id)}>
                    Claim
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <p>No drink items right now.</p>}
    </div>
  );
}

export default BartenderDash;
