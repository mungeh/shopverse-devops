import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";

function NotFound() {
  return (
    <div className="page-container state-container">
      <span className="not-found-code">404</span>

      <h1>Page not found</h1>

      <p>
        The page you requested does not exist.
      </p>

      <a href="/" className="btn btn-primary">
        Return Home
      </a>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/products/:id"
              element={<ProductDetails />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            <Route element={<ProtectedRoute />}>
              <Route
                path="/cart"
                element={<Cart />}
              />

              <Route
                path="/orders"
                element={<Orders />}
              />
            </Route>

            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
