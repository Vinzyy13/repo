document.addEventListener("DOMContentLoaded", () => {
    const gameId = document.body.dataset.game || "unknown-game";
    const commentInput = document.getElementById("comment");
    const ratingInput = document.getElementById("rating");
    const submitBtn = document.getElementById("submit-btn");
    const commentsList = document.getElementById("comments-list");
    const avgRatingSpan = document.getElementById("avg-rating");

    // Load dari localStorage
    const storageKey = `game-comments-${gameId}`;
    let comments = JSON.parse(localStorage.getItem(storageKey)) || [];

    function renderComments() {
        commentsList.innerHTML = "";
        let totalRating = 0;

        comments.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${item.rating}⭐</strong> - ${item.text}
                <button class="delete-btn" data-index="${index}">✖</button>`;
            commentsList.appendChild(li);
            totalRating += parseInt(item.rating);
        });

        if (comments.length > 0) {
            const avg = (totalRating / comments.length).toFixed(1);
            avgRatingSpan.textContent = `${avg} / 5 dari ${comments.length} pengguna`;
        } else {
            avgRatingSpan.textContent = "Belum ada";
        }
    }

    submitBtn.addEventListener("click", () => {
        const comment = commentInput.value.trim();
        const rating = ratingInput.value;

        if (comment) {
            comments.push({ text: comment, rating });
            localStorage.setItem(storageKey, JSON.stringify(comments));
            commentInput.value = "";
            renderComments();
        }
    });

    commentsList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const index = e.target.dataset.index;
            comments.splice(index, 1);
            localStorage.setItem(storageKey, JSON.stringify(comments));
            renderComments();
        }
    });

    renderComments();
});
