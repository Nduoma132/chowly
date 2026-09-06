import { useEffect, useState } from "react";
import { api } from "../api";

interface OrderRow {
  id: string;
  status: string;
  waitingTime: number | null;
  customer: { name: string };
  waiter: { name: string };
  items: { menuItem: { name: string }; quantity: number }[];
}

const STATUSES = ["Pending", "Preparing", "Served", "Completed"];

function WaiterDash() {
  const [orders, setOrders] = useState<OrderRow[]>([]);

  const load = () => {
    api.get("/orders").then((o: OrderRow[]) =>
      setOrders(o.filter((x) => x.status !== "Completed"))
    );
  };

  useEffect(load, []);

  const update = async (id: string, status: string) => {
    await api.patch(`/orders/${id}`, { status });
    load();
  };

  return (
    <div>
      <h1>Waiter dashboard</h1>
      <p>Active orders you can progress through their stages.</p>
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Items</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.customer.name}</td>
              <td>
                {o.items.map((i, idx) => (
                  <div key={idx}>
                    {i.menuItem.name} × {i.quantity}
                  </div>
                ))}
              </td>
              <td>
                <span className="badge">{o.status}</span>
              </td>
              <td>
                <select
                  value={o.status}
                  onChange={(e) => update(o.id, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <p>No active orders right now.</p>}
    </div>
  );
}

export default WaiterDash;
