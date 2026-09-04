import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("all");
  const [sortOrder, setSortOrder] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products");

        const data =
          response.data?.products ??
          response.data?.data ??
          response.data ??
          [];

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Unable to load products:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load products from the server."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.category)
      .filter(Boolean);

    return [...new Set(values)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      result = result.filter((product) => {
        return (
          product.name?.toLowerCase().includes(search) ||
          product.description?.toLowerCase().includes(search) ||
          product.category?.toLowerCase().includes(search)
        );
      });
    }

    if (selectedCategory !== "all") {
      result = result.filter(
        (product) =>
          product.category?.toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    if (sortOrder === "price-low") {
      result.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    }

    if (sortOrder === "price-high") {
      result.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    }

    if (sortOrder === "name") {
      result.sort((a, b) =>
        String(a.name).localeCompare(String(b.name))
      );
    }

    return result;
  }, [
    products,
    searchTerm,
    selectedCategory,
    sortOrder,
  ]);

  return (
    <div className="page-container">
      <div className="page-heading">
        <span className="section-kicker">SHOPVERSE CATALOG</span>

        <h1>Explore Products</h1>

        <p>
          Browse our collection and discover products across
          multiple categories.
        </p>
      </div>

      <section className="product-toolbar">
        <div className="search-box">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(event) =>
            setSelectedCategory(event.target.value)
          }
        >
          <option value="all">All Categories</option>

          {categories.map((category) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(event) =>
            setSortOrder(event.target.value)
          }
        >
          <option value="default">Sort: Default</option>
          <option value="price-low">
            Price: Low to High
          </option>
          <option value="price-high">
            Price: High to Low
          </option>
          <option value="name">Name: A-Z</option>
        </select>
      </section>

      {!loading && !error && (
        <div className="catalog-summary">
          <span>
            Showing <strong>{filteredProducts.length}</strong>{" "}
            products
          </span>
        </div>
      )}

      {loading && (
        <div className="state-container">
          <div className="spinner"></div>
          <h3>Loading products</h3>
          <p>Retrieving the ShopVerse catalog...</p>
        </div>
      )}

      {error && !loading && (
        <div className="state-container error-state">
          <span className="state-icon">!</span>
          <h3>Unable to load products</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading &&
        !error &&
        filteredProducts.length === 0 && (
          <div className="state-container">
            <span className="state-icon">⌕</span>

            <h3>No matching products</h3>

            <p>
              Try changing your search term or category.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        filteredProducts.length > 0 && (
          <section className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.ID ?? product.id}
                product={product}
              />
            ))}
          </section>
        )}
    </div>
  );
}

export default Products;
