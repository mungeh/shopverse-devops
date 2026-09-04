import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const productId = product?.ID ?? product?.id;
  const image =
    product?.image ||
    product?.image_url ||
    "https://placehold.co/600x400?text=ShopVerse";

  const price = Number(product?.price || 0);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await api.post("/cart", {
        product_id: productId,
        quantity: 1,
      });

      alert(`${product.name} added to cart.`);
    } catch (error) {
      console.error("Add to cart failed:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to add this product to your cart."
      );
    }
  };

  return (
    <article className="product-card">
      <Link
        to={`/products/${productId}`}
        className="product-card-image-wrapper"
      >
        <img
          src={image}
          alt={product?.name || "Product"}
          className="product-card-image"
        />

        {Number(product?.stock) <= 0 && (
          <span className="out-of-stock-overlay">Out of stock</span>
        )}
      </Link>

      <div className="product-card-body">
        <div className="product-card-top">
          <span className="product-category">
            {product?.category || "General"}
          </span>

          <span
            className={
              Number(product?.stock) > 0
                ? "stock-badge stock-in"
                : "stock-badge stock-out"
            }
          >
            {Number(product?.stock) > 0
              ? `${product.stock} available`
              : "Unavailable"}
          </span>
        </div>

        <Link
          to={`/products/${productId}`}
          className="product-title-link"
        >
          <h3>{product?.name || "Unnamed product"}</h3>
        </Link>

        <p className="product-card-description">
          {product?.description
            ? product.description.length > 100
              ? `${product.description.slice(0, 100)}...`
              : product.description
            : "Discover this product on ShopVerse."}
        </p>

        <div className="product-card-footer">
          <div>
            <span className="product-price-label">Price</span>

            <span className="product-price">${price.toFixed(2)}</span>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddToCart}
            disabled={Number(product?.stock) <= 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
