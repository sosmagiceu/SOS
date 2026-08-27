(() => {
  const section = document.querySelector(".collection-reviews");
  const list = document.getElementById("products-reviews");

  if (!section || !list) return;

  const MAX_REVIEWS = 3;
  const MAX_MESSAGE_LENGTH = 220;

  function renderStars(score) {
    const safe = Math.max(0, Math.min(5, Number(score) || 0));
    const full = Math.round(safe);

    return "★".repeat(full) + "☆".repeat(5 - full);
  }

  function shorten(message) {
    const text = String(message || "").trim();

    if (text.length <= MAX_MESSAGE_LENGTH) return text;

    return text.slice(0, MAX_MESSAGE_LENGTH).replace(/\s+\S*$/, "") + "…";
  }

  function render(reviews) {
    reviews.forEach((review) => {
      const article = document.createElement("article");
      article.className = "collection-review";

      article.innerHTML = `
        <div class="collection-review-top">
          <h3 class="collection-review-name"></h3>
          <div class="collection-review-stars" aria-label="${Number(review.score)} out of 5 stars">${renderStars(review.score)}</div>
        </div>
        <p class="collection-review-message"></p>
      `;

      article.querySelector(".collection-review-name").textContent = review.name;
      article.querySelector(".collection-review-message").textContent = shorten(review.message);

      list.appendChild(article);
    });

    section.hidden = false;
  }

  fetch("/.netlify/functions/get-reviews?page=1")
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => {
      const reviews = (data && data.reviews) || [];
      const strongest = reviews
        .slice()
        .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
        .slice(0, MAX_REVIEWS);

      if (strongest.length) render(strongest);
    })
    .catch(() => {
      /* The teaser stays hidden if reviews cannot be loaded. */
    });
})();
