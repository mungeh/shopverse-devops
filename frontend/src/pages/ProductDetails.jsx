import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/products/${id}`);

        const data =
          response.data?.product ??
          response.data?.data ??
          response.data;

        setProduct(data);
      } catch (err) {
        console.error("Product request failed:", err);

        setError(
          err.response?.data?.message ||
            "This product could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const decreaseQuantity = () => {
    setQuantity((current) =>
      current > 1 ? current - 1 : 1
    );
  };

  const increaseQuantity = () => {
    if (
      !product?.stock ||
      quantity < Number(product.stock)
    ) {
      setQuantity((current) => current + 1);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        state: {
          from: `/products/${id}`,
        },
      });

      return;
    }

    try {
      setAdding(true);

      await api.post("/cart", {
        product_id: product.ID ?? product.id,
        quantity,
      });

      alert("Product added to your cart.");
    } catch (err) {
      console.error("Unable to add product:", err);

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to add this product to your cart."
      );
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container state-container">
        <div className="spinner"></div>
        <h3>Loading product</h3>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-container state-container error-state">
        <span className="state-icon">!</span>

        <h2>Product unavailable</h2>

        <p>{error}</p>

        <Link to="/products" className="btn btn-primary">
          Return to Products
        </Link>
      </div>
    );
  }

  const price = Number(product.price || 0);

  const image =
    product.image ||
    product.image_url ||
    "https://placehold.co/700x600?text=ShopVerse";

  return (
    <div className="page-container">
      <Link to="/products" className="back-link">
        ← Back to Products
      </Link>

      <section className="product-detail-layout">
        <div className="product-detail-image-container">
          <img
            src={image}
            alt={product.name}
            className="product-detail-image"
          />
        </div>

        <div className="product-detail-info">
          <span className="product-category">
            {product.category || "General"}
          </span>

          <h1>{product.name}</h1>

          <div className="product-detail-price">
            ${price.toFixed(2)}
          </div>

          <div
            className={
              Number(product.stock) > 0
                ? "availability-box available-box"
                : "availability-box unavailable-box"
            }
          >
            <span></span>

            {Number(product.stock) > 0
              ? `In stock — ${product.stock} available`
              : "Currently out of stock"}
          </div>

          <p className="product-detail-description">
            {product.description ||
              "No description is currently available for this product."}
          </p>

          {Number(product.stock) > 0 && (
            <>
              <div className="quantity-section">
                <label>Quantity</label>

                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary add-cart-large"
                disabled={adding}
                onClick={handleAddToCart}
              >
                {adding
                  ? "Adding to Cart..."
                  : `Add ${quantity} to Cart`}
              </button>
            </>
          )}

          <div className="product-benefits">
            <div>
              <span>✓</span>
              Secure checkout
            </div>

            <div>
              <span>✓</span>
              Easy order management
            </div>

            <div>
              <span>✓</span>
              Responsive shopping experience
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductDetails;
