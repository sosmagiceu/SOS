(() => {
      const form = document.getElementById("review-form");
      const statusEl = document.getElementById("review-form-status");
      const reviewsList = document.getElementById("reviews-list");
      const reviewsEmpty = document.getElementById("reviews-empty");
      const reviewsPagination = document.getElementById("reviews-pagination");
      const reviewsPrev = document.getElementById("reviews-prev");
      const reviewsNext = document.getElementById("reviews-next");
      const reviewsPageSelect = document.getElementById("reviews-page-select");
      const averageStars = document.getElementById("reviews-average-stars");
      const averageText = document.getElementById("reviews-average-text");
      const starsText = document.getElementById("reviews-stars-text");
      const starInputs = Array.from(document.querySelectorAll(".reviews-star-input"));

      let currentPage = 1;
      let totalPages = 1;

      function renderDisplayStars(score) {
        const safe = Math.max(0, Math.min(5, Number(score) || 0));
        const full = Math.floor(safe);
        const hasHalf = safe - full >= 0.5;
        const empty = 5 - full - (hasHalf ? 1 : 0);

        return (
          `<span class="is-filled">${"★".repeat(full)}</span>` +
          (hasHalf ? `<span class="is-half">★</span>` : "") +
          `<span class="is-empty">${"☆".repeat(empty)}</span>`
        );
      }

      function renderCardStars(score) {
        return renderDisplayStars(score);
      }

      function renderAverageStars(score) {
        const safe = Math.max(0, Math.min(5, Number(score) || 0));
        averageStars.innerHTML = renderDisplayStars(safe);
        averageText.textContent = `Average ${safe.toFixed(1)} out of 5 stars`;
      }

      function renderReviews(items) {
        reviewsList.innerHTML = "";

        if (!items || !items.length) {
          reviewsEmpty.hidden = false;
          return;
        }

        reviewsEmpty.hidden = true;

        items.forEach((review) => {
          const article = document.createElement("article");
          article.className = "review-card";

          article.innerHTML = `
            <div class="review-card-top">
              <h3 class="review-card-name"></h3>
              <div class="review-card-stars" aria-label="${Number(review.score)} out of 5 stars">${renderCardStars(review.score)}</div>
            </div>
            <p class="review-card-message"></p>
          `;

          article.querySelector(".review-card-name").textContent = review.name;
          article.querySelector(".review-card-message").textContent = review.message;

          reviewsList.appendChild(article);
        });
      }

      function updatePageSelect() {
        reviewsPageSelect.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
          const option = document.createElement("option");
          option.value = i;
          option.textContent = i;
          option.selected = i === currentPage;
          reviewsPageSelect.appendChild(option);
        }
      }

      async function loadReviews(page = 1) {
        try {
          const res = await fetch(`/.netlify/functions/get-reviews?page=${page}`);
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || "Failed to load reviews");
          }

          const avg = data.average_score ?? data.averageScore ?? 0;
          const pageValue = data.page || 1;
          const totalValue = data.total_pages ?? data.totalPages ?? 1;

          renderAverageStars(avg);
          renderReviews(data.reviews || []);

          currentPage = pageValue;
          totalPages = totalValue;

          updatePageSelect();

          reviewsPrev.disabled = currentPage <= 1;
          reviewsNext.disabled = currentPage >= totalPages;
          reviewsPagination.hidden = totalPages <= 1;
        } catch (err) {
          reviewsList.innerHTML = "";
          reviewsEmpty.hidden = false;
          reviewsEmpty.textContent = "Could not load reviews.";
          reviewsPagination.hidden = true;
          renderAverageStars(0);
        }
      }

      function updateSelectedStarsText() {
        const checked = document.querySelector(".reviews-star-input:checked");
        if (!checked) {
          starsText.textContent = "Select stars";
          return;
        }

        const value = Number(checked.value);
        starsText.textContent = value === 1 ? "1 star selected" : `${value} stars selected`;
      }

      starInputs.forEach((input) => {
        input.addEventListener("change", updateSelectedStarsText);
      });

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        statusEl.textContent = "Sending...";
        statusEl.classList.remove("is-error", "is-success");

        const checkedScore = document.querySelector(".reviews-star-input:checked");

        const data = {
          name: form.name.value.trim(),
          message: form.message.value.trim(),
          score: checkedScore ? parseInt(checkedScore.value, 10) : null
        };

        try {
          const res = await fetch("/.netlify/functions/submit-review", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          });

          const result = await res.json();

          if (!res.ok) {
            throw new Error(result.error || "Something went wrong");
          }

          form.reset();
          updateSelectedStarsText();
          statusEl.textContent = "Your review has been sent to us.";
          statusEl.classList.add("is-success");
        } catch (err) {
          statusEl.textContent = err.message || "Something went wrong. Please try again.";
          statusEl.classList.add("is-error");
        }
      });

      reviewsPrev.addEventListener("click", () => {
        if (currentPage > 1) {
          loadReviews(currentPage - 1);
        }
      });

      reviewsNext.addEventListener("click", () => {
        if (currentPage < totalPages) {
          loadReviews(currentPage + 1);
        }
      });

      reviewsPageSelect.addEventListener("change", () => {
        loadReviews(parseInt(reviewsPageSelect.value, 10));
      });

      updateSelectedStarsText();
      renderAverageStars(0);
      loadReviews(1);
    })();
