import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const plantService = {
  async getPlants() {
    try {
      const response = await axios.get(`${API_URL}/plants`);
      return response.data;
    } catch (error) {
      console.error('Error fetching plants:', error);
      throw error;
    }
  },

  async getRecommendations(userPreferences) {
    try {
      const response = await axios.post(`${API_URL}/plants/recommendations`, { userPreferences });
      return response.data;
    } catch (error) {
      console.error('Error getting plant recommendations:', error);
      throw error;
    }
  }
};