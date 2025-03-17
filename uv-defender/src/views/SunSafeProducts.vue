<template>
  <div class="sun-safe-products-container">
    <h1>Sun-Safe Products</h1>
    <p class="description">
      Find and access sun-safe products to protect yourself from harmful UV
      rays. Browse our recommended products or filter by category to find what
      you need.
    </p>

    <div class="filter-section">
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search products..."
          class="search-input"
          @input="filterProducts"
        />
      </div>
      <div class="category-filters">
        <button
          @click="selectCategory('all')"
          :class="['category-btn', selectedCategory === 'all' ? 'active' : '']"
        >
          All Products
        </button>
        <button
          @click="selectCategory('sunscreen')"
          :class="[
            'category-btn',
            selectedCategory === 'sunscreen' ? 'active' : '',
          ]"
        >
          Sunscreen
        </button>
        <button
          @click="selectCategory('clothing')"
          :class="[
            'category-btn',
            selectedCategory === 'clothing' ? 'active' : '',
          ]"
        >
          Sun-Protective Clothing
        </button>
        <button
          @click="selectCategory('sunglasses')"
          :class="[
            'category-btn',
            selectedCategory === 'sunglasses' ? 'active' : '',
          ]"
        >
          Sunglasses
        </button>
      </div>
    </div>

    <div class="loading-message" v-if="loading">
      <div class="spinner"></div>
      <p>Loading products...</p>
    </div>

    <div class="error-message" v-if="error">
      <p>{{ error }}</p>
      <button @click="fetchProducts" class="retry-btn">Try Again</button>
    </div>

    <div
      class="no-results"
      v-if="!loading && !error && filteredProducts.length === 0"
    >
      <p>No products found matching your search criteria.</p>
    </div>

    <div
      class="products-grid"
      v-if="!loading && !error && filteredProducts.length > 0"
    >
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
      >
        <div class="product-image">
          <img
            :src="product.imageUrl || getDefaultImage(product.category)"
            :alt="product.name"
          />
        </div>
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="product-description">{{ product.description }}</p>
          <p class="product-price">${{ product.price.toFixed(2) }}</p>
          <a :href="product.purchaseLink" target="_blank" class="buy-btn">
            Buy Now
          </a>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h2>Choosing the Right Sun Protection</h2>
      <div class="info-columns">
        <div class="info-column">
          <h3>Sunscreen</h3>
          <ul>
            <li>Choose broad-spectrum protection (UVA and UVB)</li>
            <li>SPF 30+ for everyday use</li>
            <li>SPF 50+ for extended outdoor activities</li>
            <li>Water-resistant formulas for swimming or sweating</li>
            <li>Reapply every 2 hours when outdoors</li>
          </ul>
        </div>
        <div class="info-column">
          <h3>Clothing</h3>
          <ul>
            <li>Look for UPF (Ultraviolet Protection Factor) rating</li>
            <li>UPF 50+ provides excellent protection</li>
            <li>Tightly woven fabrics offer better protection</li>
            <li>Dark colors typically block more UV than light colors</li>
            <li>Wide-brimmed hats protect face, ears, and neck</li>
          </ul>
        </div>
        <div class="info-column">
          <h3>Sunglasses</h3>
          <ul>
            <li>Look for 99-100% UV protection</li>
            <li>Larger frames provide more coverage</li>
            <li>Wrap-around styles protect from side exposure</li>
            <li>
              Polarized lenses reduce glare but don't affect UV protection
            </li>
            <li>UV protection is not related to lens darkness</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SunSafeProducts",
  data() {
    return {
      products: [],
      filteredProducts: [],
      selectedCategory: "all",
      searchQuery: "",
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;

      try {
        // Fetch products from database endpoint
        const response = await axios.get(
          "/api/sun-safe-products/from-database",
          { params: { category: this.selectedCategory !== 'all' ? this.selectedCategory : undefined } }
        );
        this.products = response.data;

        // Filter products based on search query
        this.filterProducts();
        this.loading = false;
      } catch (error) {
        console.error("Error fetching products:", error);
        this.error = "Failed to load products. Please try again.";
        this.loading = false;
      }
    },
    selectCategory(category) {
      this.selectedCategory = category;
      this.fetchProducts();
    },
    filterProducts() {
      // Filter by search query
      if (this.searchQuery.trim() !== "") {
        const query = this.searchQuery.toLowerCase();
        this.filteredProducts = this.products.filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
      } else {
        this.filteredProducts = this.products;
      }
    },
    getDefaultImage(category) {
      // Return default image based on category
      switch (category) {
        case "sunscreen":
          return "https://via.placeholder.com/300x300?text=Sunscreen";
        case "clothing":
          return "https://via.placeholder.com/300x300?text=Sun+Protection+Clothing";
        case "sunglasses":
          return "https://via.placeholder.com/300x300?text=Sunglasses";
        default:
          return "https://via.placeholder.com/300x300?text=Sun+Protection+Product";
      }
    },
  },
};
</script>

<style scoped>
.sun-safe-products-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
}

.description {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 30px;
  color: #555;
  line-height: 1.6;
}

.filter-section {
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search-box {
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ced4da;
  border-radius: 25px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.category-btn {
  padding: 8px 15px;
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-btn:hover {
  background-color: #e9ecef;
}

.category-btn.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.loading-message,
.error-message,
.no-results {
  text-align: center;
  padding: 40px 0;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.retry-btn {
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.product-card {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: white;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.product-image {
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 20px;
}

.product-info h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #2c3e50;
}

.product-description {
  color: #6c757d;
  margin-bottom: 15px;
  font-size: 0.9rem;
  line-height: 1.5;
}

.product-price {
  font-weight: bold;
  color: #28a745;
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.buy-btn {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.buy-btn:hover {
  background-color: #0069d9;
}

.info-section {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 30px;
  margin-top: 40px;
}

.info-section h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #2c3e50;
}

.info-columns {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: space-between;
}

.info-column {
  flex: 1;
  min-width: 250px;
}

.info-column h3 {
  color: #007bff;
  margin-bottom: 15px;
}

.info-column ul {
  padding-left: 20px;
}

.info-column li {
  margin-bottom: 8px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .info-columns {
    flex-direction: column;
  }

  .category-filters {
    flex-direction: column;
    width: 100%;
  }

  .category-btn {
    width: 100%;
  }
}
</style>
