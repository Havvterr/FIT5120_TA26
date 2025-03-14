<template>
  <div>
    <div id="map" class="map-container"></div>
    <div class="input-container">
      <input
        type="text"
        v-model="start"
        placeholder="Start location"
        class="form-input"
      />
      <input
        type="text"
        v-model="end"
        placeholder="End location"
        class="form-input"
      />
      <button @click="getDirections" class="form-button">Get Directions</button>
    </div>

    <!-- Display trip information if available -->
    <p v-if="tripInfo" class="trip-info">{{ tripInfo }}</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <div v-if="loading" class="loading-spinner"></div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import axios from "axios";

export default {
  name: "MapboxMap",
  data() {
    return {
      map: null,
      start: "",
      end: "",
      directionsLayer: null,
      tripInfo: "", // For displaying trip information
      loading: false, // For displaying loading state
      errorMessage: "", // For displaying error messages
    };
  },
  mounted() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoicnV0dmlrYWd1cHRhIiwiYSI6ImNtMjAwbmp1cDBjc2Eya29ianJubG0wMmwifQ.UKj9IjcLwoNcpfMgO5fhxg"; // Your Mapbox token

    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [144.9631, -37.8136], // Default center (Melbourne)
      zoom: 4,
    });

    this.map.addControl(new mapboxgl.NavigationControl());
  },
  methods: {
    async getDirections() {
      if (!this.start || !this.end) {
        this.errorMessage = "Please enter both start and end locations.";
        return;
      }

      this.tripInfo = "";
      this.errorMessage = "";
      this.loading = true;

      try {
        // Convert start and end locations to coordinates using Mapbox Geocoding API
        const startCoords = await this.geocodeLocation(this.start);
        const endCoords = await this.geocodeLocation(this.end);

        // Get directions from Mapbox Directions API
        const response = await axios.get(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords.join(
            ","
          )};${endCoords.join(",")}?geometries=geojson&access_token=${
            mapboxgl.accessToken
          }`
        );

        const route = response.data.routes[0];

        // Extract distance and duration from the route
        const distance = (route.distance / 1000).toFixed(2); // Convert to kilometers
        const duration = (route.duration / 60).toFixed(2); // Convert to minutes

        // Display the distance and duration to the user
        this.tripInfo = `Distance: ${distance} km, Duration: ${duration} minutes`;

        // Remove previous route if it exists
        if (this.directionsLayer) {
          this.map.removeLayer(this.directionsLayer);
          this.map.removeSource(this.directionsLayer);
        }

        // Add the new route layer
        this.directionsLayer = `routeLayer-${Date.now()}`;
        this.map.addSource(this.directionsLayer, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: route.geometry,
          },
        });

        this.map.addLayer({
          id: this.directionsLayer,
          type: "line",
          source: this.directionsLayer,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3887be",
            "line-width": 5,
          },
        });

        // Adjust the map bounds to include the entire route
        const bounds = new mapboxgl.LngLatBounds();
        route.geometry.coordinates.forEach((coord) => {
          bounds.extend(coord);
        });

        // Fit the map to the bounds with padding
        this.map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 10,
          duration: 1000, // Smooth transition
        });
      } catch (error) {
        this.errorMessage = "Error fetching directions. Please try again.";
        console.error("Error fetching directions:", error);
      } finally {
        this.loading = false;
      }
    },

    async geocodeLocation(location) {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          location
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const features = response.data.features;
      if (!features.length) {
        throw new Error(`No results found for location: ${location}`);
      }
      return features[0].center; // Return the coordinates [longitude, latitude]
    },
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 500px; /* Increased height for better visibility */
  margin-bottom: 20px;
  border: 2px solid #ddd;
  border-radius: 8px;
}

.input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.form-input {
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 250px; /* Reduced width for better alignment */
}

.form-button {
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.form-button:hover {
  background-color: #0056b3;
}

.trip-info {
  font-size: 18px;
  color: #333;
  margin-top: 10px;
  text-align: center;
}

.error-message {
  color: red;
  font-size: 16px;
  margin-top: 10px;
  text-align: center;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Media query for smaller screens */
@media (max-width: 768px) {
  .input-container {
    flex-direction: column;
    gap: 10px;
  }

  .form-input {
    width: 100%;
  }

  .form-button {
    width: 100%;
  }
}
</style>
