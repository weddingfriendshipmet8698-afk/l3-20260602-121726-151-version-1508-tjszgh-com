(function () {
  const header = document.querySelector(".site-header");
  const navButton = document.querySelector(".nav-toggle");

  if (header && navButton) {
    navButton.addEventListener("click", function () {
      header.classList.toggle("nav-open");
    });
  }

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".hero-dot"));
  let active = 0;
  let timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    active = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === active);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === active);
    });
  }

  function startHero() {
    if (timer || slides.length < 2) {
      return;
    }

    timer = window.setInterval(function () {
      showSlide(active + 1);
    }, 5200);
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index);
      window.clearInterval(timer);
      timer = null;
      startHero();
    });
  });

  startHero();

  const searchInput = document.querySelector(".movie-search");
  const yearFilter = document.querySelector(".year-filter");
  const scope = document.querySelector(".search-scope") || document;
  const cards = Array.from(scope.querySelectorAll(".searchable-card"));

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function filterCards() {
    const query = normalize(searchInput ? searchInput.value : "");
    const year = yearFilter ? yearFilter.value : "";

    cards.forEach(function (card) {
      const text = normalize([
        card.dataset.title,
        card.dataset.year,
        card.dataset.region,
        card.dataset.genre,
        card.textContent
      ].join(" "));
      const matchText = !query || text.includes(query);
      const matchYear = !year || card.dataset.year === year;
      card.classList.toggle("is-filtered-out", !(matchText && matchYear));
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterCards);
  }

  if (yearFilter) {
    yearFilter.addEventListener("change", filterCards);
  }
})();
