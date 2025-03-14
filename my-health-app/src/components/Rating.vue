<template>
  <div class="rating">
    <h3>Rate Us</h3>
    <!-- Conditional rendering of stars based on the current rating -->
    <div>
      <span
        v-for="star in 5"
        :key="star"
        @click="rate(star)"
        :class="{ filled: star <= rating }"
        >★</span
      >
    </div>
    <p>Your Rating: {{ rating }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rating: 0,
    };
  },
  methods: {
    rate(value) {
      this.rating = value;
    },
  },
};
</script>

<style scoped>
.rating span {
  font-size: 2rem;
  cursor: pointer;
  color: #ccc; /* Default color for unselected stars */
}
.rating span.filled {
  color: gold; /* Filled color for selected stars */
}
</style>
