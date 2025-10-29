import axios from "axios";

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "32802293-5821b85c58537e1609d134566";

export async function getImagesByQuery(query, page = 1) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    per_page: 15,
    page: page,
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error("Помилка під час отримання зображень:", error.message);
    throw error;
  }
}
