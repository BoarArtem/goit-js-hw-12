import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { getImagesByQuery } from "./js/pixabay-api.js";
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from "./js/render-functions.js";
import { resetPage } from "./js/pixabay-api.js";

const form = document.querySelector(".form");
const input = document.querySelector(".search-text");
const loadMoreButton = document.querySelector(".load-more")

let currentQuery = ""

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = input.value.trim();

  if (query === "") {
    iziToast.warning({
      title: "Увага",
      message: "Введіть слово для пошуку!",
      position: "topRight",
    });
    return;
  }

  clearGallery();
  loadMoreButton.hidden = true;
  showLoader();

  try {
    resetPage()
    currentQuery = query
    const data = await getImagesByQuery(query);

    if (data.hits.length === 0) {
      iziToast.info({
        title: "Нічого не знайдено",
        message:
          "Sorry, there are no images matching your search query. Please try again!",
        position: "topRight",
      });
      hideLoader();
      return;
    }

    createGallery(data.hits);


    if (data.hits.length === 15) {
      loadMoreButton.hidden = false;
    }
  } catch (error) {
    iziToast.error({
      title: "Помилка",
      message: "Виникла проблема з отриманням даних!",
      position: "topRight",
    });
    console.error(error);
  } finally {
    hideLoader();
  }
});


loadMoreButton.addEventListener("click", async () => {
  showLoader()

  try {
    const data = await getImagesByQuery(currentQuery)
    createGallery(data.hits)

    window.scrollBy({
      top: window.innerHeight * 0.6,
      behavior: "smooth",
    });

    if (data.hits.length < 15) {
      iziToast.info({
        title: "Кінець колекції",
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });
      loadMoreButton.hidden = true
    }
  } catch (error) {
    iziToast.error({
      title: "Помилка",
      message: "Error",
      position: "topRight",
    });
    console.error(error)
  } finally {
    hideLoader()
  }
})