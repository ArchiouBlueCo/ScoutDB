import axios from "axios";

// const apiUrl = "https://intrepidscouting.onrender.com";
const apiUrl = "https://archioubluecoscouting.onrender.com";


// Base URL for your backend API 
const API_BASE_URL = apiUrl;

// Helper function to make API requests
const apiRequest = async (method, endpoint, data = null, headers = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await axios({
      method,
      url,
      data,
      headers,
    });
    console.log("Connection successfull");
    return response.data;  // Return the actual data from the response
  } catch (error) {
    // Log and handle errors universally here
    console.error("API Request failed:", error.response ? error.response.data : error.message);
    throw error;  // Re-throw to handle in component if needed
  }
};

// Universal API request methods
export const apiService = {
  get: (endpoint, headers = {}) => apiRequest("GET", endpoint, null, headers),
  post: (endpoint, data, headers = {}) => apiRequest("POST", endpoint, data, headers),
  put: (endpoint, data, headers = {}) => apiRequest("PUT", endpoint, data, headers),
  patch: (endpoint, data, headers = {}) => apiRequest("PATCH", endpoint, data, headers),
  delete: (endpoint, headers = {}) => apiRequest("DELETE", endpoint, null, headers),
};
 
