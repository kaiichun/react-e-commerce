import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import ProductAdd from "./ProductAdd";
import ProductEdit from "./ProductEdit";
import Cart from "./Cart";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product_add" element={<ProductAdd />} />
        <Route path="/product/:id" element={<ProductEdit />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;
