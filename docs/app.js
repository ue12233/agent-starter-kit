const searchInput = document.querySelector("#resource-search");
const filterButtons = Array.from(document.querySelectorAll(".filter"));
const cards = Array.from(document.querySelectorAll(".resource-card"));
const sections = Array.from(document.querySelectorAll(".resource-section"));
const emptyState = document.querySelector("#empty-state");

let activeFilter = "all";

function normalize(value) {
  return value.trim().toLowerCase();
}

function getCardText(card) {
  return normalize(`${card.textContent ?? ""} ${card.dataset.search ?? ""}`);
}

function applyFilters() {
  const query = normalize(searchInput?.value ?? "");
  let visibleCards = 0;

  for (const card of cards) {
    const matchesKind = activeFilter === "all" || card.dataset.kind === activeFilter;
    const matchesQuery = !query || getCardText(card).includes(query);
    const isVisible = matchesKind && matchesQuery;

    card.hidden = !isVisible;
    if (isVisible) {
      visibleCards += 1;
    }
  }

  for (const section of sections) {
    const hasVisibleCards = section.querySelectorAll(".resource-card:not([hidden])").length > 0;
    section.hidden = !hasVisibleCards;
  }

  if (emptyState) {
    emptyState.hidden = visibleCards > 0;
  }
}

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter ?? "all";

    for (const currentButton of filterButtons) {
      const isActive = currentButton === button;
      currentButton.classList.toggle("is-active", isActive);
      currentButton.setAttribute("aria-pressed", String(isActive));
    }

    applyFilters();
  });
}

searchInput?.addEventListener("input", applyFilters);
applyFilters();
