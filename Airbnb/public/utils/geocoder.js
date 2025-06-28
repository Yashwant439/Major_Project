const axios = require("axios");

const geocodeLocation = async (location) => {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: location,
        format: "json",
        limit: 1
      },
      headers: {
        'User-Agent': 'wanderlust-app'
      }
    });

    if (response.data.length === 0) return null;

    const place = response.data[0];
    return {
      type: "Point",
      coordinates: [parseFloat(place.lon), parseFloat(place.lat)]
    };
  } catch (err) {
    console.error("Geocoding failed:", err.message);
    return null;
  }
};

module.exports = geocodeLocation;
