    function renderGames(filter = "") {
    const list = document.getElementById("game-list");
    list.innerHTML = "";
  
    const filtered = games.filter(
      (g) =>
        g.name.toLowerCase().includes(filter.toLowerCase()) ||
        g.genre.toLowerCase().includes(filter.toLowerCase()) ||
        g.description.toLowerCase().includes(filter.toLowerCase())
    );
  
    if (filtered.length === 0) {
      list.innerHTML = "<p>Tidak ada game yang cocok.</p>";
      return;
    }
  
    filtered.forEach((game) => {
      const card = document.createElement("div");
      card.className = "game-card";
      card.innerHTML = `
        <h2>${game.name}</h2>
        <p><strong>Genre:</strong> ${game.genre}</p>
        <p>${game.description}</p>
        <a href="${game.id}.html" style="color: #00ffc3; text-decoration: none;">Lihat detail & review</a>
      `;
      list.appendChild(card);
    });
  }
  
  window.addEventListener("DOMContentLoaded", () => {
    renderGames();
  
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", () => {
      renderGames(searchInput.value);
    });
  });
  