import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import RestaurantMenu from "./pages/RestaurantMenu";
import Order from "./pages/Order";
import Pay from "./pages/Pay";
import Track from "./pages/Track";
import WaiterDash from "./pages/WaiterDash";
import ChefDash from "./pages/ChefDash";
import BartenderDash from "./pages/BartenderDash";
import Admin from "./pages/Admin";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <header className="nav">
        <Link to="/" className="brand">🍔 Chowly</Link>
        <nav>
          <Link to="/">Restaurants</Link>
          <Link to="/waiter">Waiter</Link>
          <Link to="/chef">Chef</Link>
          <Link to="/bartender">Bartender</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants/:id" element={<RestaurantMenu />} />
          <Route path="/order/:restaurantId" element={<Order />} />
          <Route path="/pay/:orderId" element={<Pay />} />
          <Route path="/track/:orderId" element={<Track />} />
          <Route path="/waiter" element={<WaiterDash />} />
          <Route path="/chef" element={<ChefDash />} />
          <Route path="/bartender" element={<BartenderDash />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
