import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/orders");

        const data =
          response.data?.orders ??
          response.data?.data ??
          response.data ??
          [];

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Unable to load orders:", err);

        setError(
          err.response?.data?.message ||
            "Unable to retrieve your order history."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="page-container state-container">
        <div className="spinner"></div>

        <h3>Loading your orders</h3>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <span className="section-kicker">
          ORDER HISTORY
        </span>

        <h1>My Orders</h1>

        <p>
          Review orders created from your ShopVerse account.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {!error && orders.length === 0 && (
        <div className="state-container">
          <span className="state-icon">📦</span>

          <h2>No orders yet</h2>

          <p>
            Once you complete your first order, it will
            appear here.
          </p>

          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      )}

      {orders.length > 0 && (
        <section className="orders-list">
          {orders.map((order) => {
            const orderId = order.ID ?? order.id;

            const createdDate =
              order.created_at ??
              order.CreatedAt ??
              order.createdAt;

            const items =
              order.items ??
              order.Items ??
              [];

            return (
              <article
                className="order-card"
                key={orderId}
              >
                <div className="order-card-header">
                  <div>
                    <span>Order number</span>
                    <strong>#{orderId}</strong>
                  </div>

                  <div>
                    <span>Date</span>

                    <strong>
                      {createdDate
                        ? new Date(
                            createdDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </strong>
                  </div>

                  <div>
                    <span>Status</span>

                    <strong className="order-status">
                      {order.status || "Processing"}
                    </strong>
                  </div>

                  <div>
                    <span>Total</span>

                    <strong className="order-total">
                      $
                      {Number(
                        order.total || 0
                      ).toFixed(2)}
                    </strong>
                  </div>
                </div>

                {items.length > 0 && (
                  <div className="order-items">
                    {items.map((item, index) => {
                      const product =
                        item.product ??
                        item.Product ??
                        {};

                      return (
                        <div
                          className="order-item"
                          key={
                            item.ID ??
                            item.id ??
                            index
                          }
                        >
                          <div>
                            <strong>
                              {product.name ||
                                `Product #${
                                  item.product_id ??
                                  item.ProductID ??
                                  "N/A"
                                }`}
                            </strong>

                            <span>
                              Quantity:{" "}
                              {item.quantity}
                            </span>
                          </div>

                          <strong>
                            $
                            {Number(
                              item.price || 0
                            ).toFixed(2)}
                          </strong>
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

export default Orders;
