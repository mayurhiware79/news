const API_KEY = "ed7b24b1b6624297bd2835652a553e1c";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
  window.location.reload();
}

async function fetchNews(query) {
  try {
    const res = await fetch(
      `${url}${encodeURIComponent(query)}&apiKey=${API_KEY}`
    );
    if (!res.ok) throw new Error(`Failed to fetch news: ${res.status}`);

    const data = await res.json();
    if (!data.articles || data.articles.length === 0) {
      displayNoResults(`No articles found for "${query}".`);
      return;
    }

    bindData(data.articles);
  } catch (error) {
    console.error("Error fetching news:", error);
    displayNoResults("Failed to load news. Please try again later.");
  }
}

function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  // Clear previous content
  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.urlToImage || !article.title || !article.description) return;

    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsImg.alt = article.title || "News Image";
  newsTitle.textContent = article.title || "No Title Available";
  newsDesc.textContent = article.description || "No description available.";

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  newsSource.textContent = `${
    article.source?.name || "Unknown Source"
  } · ${date}`;

  // Open news link on click
  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

function displayNoResults(message) {
  const cardsContainer = document.getElementById("cards-container");
  cardsContainer.innerHTML = `<p class="no-results">${message}</p>`;
}

let curSelectedNav = null;
function onNavItemClick(id) {
  fetchNews(id);

  // Update active state
  const navItem = document.getElementById(id);
  if (curSelectedNav) {
    curSelectedNav.classList.remove("active");
  }
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value.trim();
  if (!query) return;

  fetchNews(query);

  // Remove active state from nav items
  if (curSelectedNav) {
    curSelectedNav.classList.remove("active");
    curSelectedNav = null;
  }
});

// Support for "Enter" key to trigger search
searchText.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchButton.click();
  }
});
