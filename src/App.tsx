import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { POSView } from "./views/POSView";
import { InventoryView } from "./views/InventoryView";
import { OrdersView } from "./views/OrdersView";
import { MasterDataView } from "./views/MasterDataView";

function App() {
  return (
    <Router>
      <div className="max-h-screen bg-gray-100 flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/pos" replace />} />
            <Route path="/pos" element={<POSView />} />
            <Route path="/inventory" element={<InventoryView />} />
            <Route path="/orders" element={<OrdersView />} />
            <Route
              path="/categories"
              element={<MasterDataView type="categories" />}
            />
            <Route path="/brands" element={<MasterDataView type="brands" />} />
            <Route
              path="/suppliers"
              element={<MasterDataView type="suppliers" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
