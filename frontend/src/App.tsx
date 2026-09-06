import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import RestaurantMenu from "./pages/RestaurantMenu";
import Order from "./pages/Order";
import Pay from "./pages/Pay";
import Track from "./pages/Track";
import Admin from "./pages/Admin";
import WaiterHome from "./pages/WaiterHome";
import "./App.css";

function App() {
  const [role, setRole] = useState<"customer" | "waiter">("customer");

  return (
    <BrowserRouter>
      <header className="nav">
        <Link to="/" className="brand">🍔 Chowly</Link>
        <nav>
          {/* simple role switch — no login required */}
          <span className="role-switch">
            <button
              className={role === "customer" ? "role-btn active" : "role-btn"}
              onClick={() => setRole("customer")}
            >
              Customer
            </button>
            <button
              className={role === "waiter" ? "role-btn active" : "role-btn"}
              onClick={() => setRole("waiter")}
            >
              Waiter
            </button>
          </span>
          {role === "waiter" && (
            <Link to="/waiter">Waiter dashboard</Link>
          )}
          <Link to="/admin">Admin</Link>
        </nav>
      </header>
      <main className="page">
        {role === "waiter" ? (
          <Routes>
            <Route path="/waiter" element={<WaiterHome />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/waiter" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurants/:id" element={<RestaurantMenu />} />
            <Route path="/order/:restaurantId" element={<Order />} />
            <Route path="/pay/:orderId" element={<Pay />} />
            <Route path="/track/:orderId" element={<Track />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
    </BrowserRouter>
  );
}

export default App;
