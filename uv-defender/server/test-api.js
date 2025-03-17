const axios = require("axios");

async function testUVAPI() {
  try {
    const response = await axios.get("https://api.openuv.io/api/v1/uv", {
      params: {
        lat: -37.8136,
        lng: 144.9631,
        alt: 100,
      },
      headers: {
        "x-access-token": "openuv-9ig6rm8bmqom3-io",
        "Content-Type": "application/json",
      },
    });

    console.log("API Response:", response.data);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
  }
}

testUVAPI();
