import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] =
    useState(false);
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cart");

      const data =
        response.data?.cart ??
        response.data?.items ??
        response.data?.data ??
        response.data ??
        [];

      setCartItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Unable to load cart:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your shopping cart."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const updateQuantity = async (
    itemId,
    newQuantity
  ) => {
    if (newQuantity < 1) {
      return;
    }

    try {
      await api.put(`/cart/${itemId}`, {
        quantity: newQuantity,
      });

      setCartItems((currentItems) =>
        currentItems.map((item) =>
          (item.ID ?? item.id) === itemId
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Unable to update quantity:", err);

      alert(
        err.response?.data?.message ||
          "Unable to update cart quantity."
      );
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);

      setCartItems((currentItems) =>
        currentItems.filter(
          (item) => (item.ID ?? item.id) !== itemId
        )
      );
    } catch (err) {
      console.error("Unable to remove cart item:", err);

      alert(
        err.response?.data?.message ||
          "Unable to remove this item."
      );
    }
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const product =
        item.product ?? item.Product ?? {};

      return (
        total +
        Number(product.price || item.price || 0) *
          Number(item.quantity || 1)
      );
    }, 0);
  }, [cartItems]);

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);

      const response = await api.post("/orders");

      const order =
        response.data?.order ??
        response.data?.data ??
        response.data;

      setCartItems([]);

      alert(
        order?.id || order?.ID
          ? `Order #${order.id ?? order.ID} created successfully.`
          : "Order created successfully."
      );

      navigate("/orders");
    } catch (err) {
      console.error("Checkout failed:", err);

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to complete your order."
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container state-container">
        <div className="spinner"></div>

        <h3>Loading your cart</h3>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <span className="section-kicker">YOUR BAG</span>

        <h1>Shopping Cart</h1>

        <p>
          Review the products you selected before creating
          your order.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {!error && cartItems.length === 0 && (
        <div className="state-container">
          <span className="state-icon">🛒</span>

          <h2>Your cart is empty</h2>

          <p>
            Add a few products and they will appear here.
          </p>

          <Link to="/products" className="btn btn-primary">
            Explore Products
          </Link>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="cart-layout">
          <section className="cart-items">
            {cartItems.map((item) => {
              const itemId = item.ID ?? item.id;

              const product =
                item.product ?? item.Product ?? {};

              const image =
                product.image ||
                product.image_url ||
                "https://placehold.co/150x150?text=Product";

              const price = Number(
                product.price || item.price || 0
              );

              return (
                <article className="cart-item" key={itemId}>
                  <img
                    src={image}
                    alt={product.name || "Product"}
                    className="cart-item-image"
                  />

                  <div className="cart-item-info">
                    <span className="product-category">
                      {product.category || "General"}
                    </span>

                    <h3>
                      {product.name || "Product"}
                    </h3>

                    <span className="cart-item-price">
                      ${price.toFixed(2)}
                    </span>
                  </div>

                  <div className="cart-item-controls">
                    <div className="quantity-control">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            itemId,
                            Number(item.quantity) - 1
                          )
                        }
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            itemId,
                            Number(item.quantity) + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="remove-cart-item"
                      onClick={() => removeItem(itemId)}
                    >
                      Remove
                    </button>
                  </div>

                  <strong className="cart-line-total">
                    $
                    {(
                      price * Number(item.quantity || 1)
                    ).toFixed(2)}
                  </strong>
                </article>
              );
            })}
          </section>

          <aside className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <strong>Free</strong>
            </div>

            <div className="summary-row">
              <span>Estimated tax</span>
              <strong>$0.00</strong>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row summary-total">
              <span>Total</span>

              <strong>${subtotal.toFixed(2)}</strong>
            </div>

            <button
              type="button"
              className="btn btn-primary checkout-button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading
                ? "Creating Order..."
                : "Place Order"}
            </button>

            <Link
              to="/products"
              className="continue-shopping"
            >
              ← Continue Shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;
