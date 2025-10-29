import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { getImagesByQuery } from "./js/pixabay-api.js";
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton
} from "./js/render-functions.js";

const form = document.querySelector(".form");
const input = document.querySelector(".search-text");
const loadMoreButton = document.querySelector(".load-more");

let currentPage = 1;
let currentQuery = "";
let totalHits = 0;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = input.value.trim();

  if (!query) {
    iziToast.warning({
      title: "Увага",
      message: "Введіть слово для пошуку!",
      position: "topRight",
    });
    return;
  }

  clearGallery();
  hideLoadMoreButton()
  showLoader();

  try {
    currentQuery = query;
    currentPage = 1;

    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.info({
        title: "Нічого не знайдено",
        message:
          "Sorry, there are no images matching your search query. Please try again!",
        position: "topRight",
      });
      return;
    }

    createGallery(data.hits);
    checkLoadMoreVisibility(data.hits.length);
  } catch (error) {
    iziToast.error({
      title: "Помилка",
      message: "Виникла проблема з отриманням даних!",
      position: "topRight",
    });
  } finally {
    hideLoader();
  }
});

loadMoreButton.addEventListener("click", async () => {
  currentPage += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    createGallery(data.hits);
    smoothScroll();
    checkLoadMoreVisibility(data.hits.length);
  } catch (error) {
    iziToast.error({
      title: "Помилка",
      message: "Error",
      position: "topRight",
    });
  } finally {
    hideLoader();
  }
});

function smoothScroll() {
  const gallery = document.querySelector(".gallery");
  if (!gallery.firstElementChild) return;

  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}


function checkLoadMoreVisibility(loadedCount) {
  const totalLoaded = currentPage * 15;

  if (totalLoaded >= totalHits || loadedCount < 15) {
    hideLoadMoreButton()
    iziToast.info({
      title: "Кінець колекції",
      message: "You've reached the end of search results.",
      position: "topRight",
    });
  } else {
    showLoadMoreButton()
  }
}
