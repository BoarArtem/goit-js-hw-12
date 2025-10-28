import axios from "axios";

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "32802293-5821b85c58537e1609d134566"; 

let currentPage = 1;
export let currentQuery = ""

export async function getImagesByQuery(query) {
  if(query !== currentQuery) {
    currentQuery = query
    currentPage = 1
  }

  const params = {
    key: API_KEY,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    per_page: 15,
    page: currentPage,

  };

  try {
    const response = await axios.get(BASE_URL, { params })
    currentPage += 1

    return response.data
  } catch (error) {
    console.error("Помилка під час отримання зображень:", error.message);
    throw error
  }
}

export function resetPage() {
  currentPage = 1;
}