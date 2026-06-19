(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-main-nav]');

  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
  var clearButtons = Array.prototype.slice.call(document.querySelectorAll('[data-search-clear]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
  var yearButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-year]'));
  var activeYear = 'all';

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function getQuery() {
    for (var i = 0; i < searchInputs.length; i += 1) {
      if (searchInputs[i].value.trim()) {
        return normalize(searchInputs[i].value);
      }
    }
    return '';
  }

  function applyFilters() {
    var query = getQuery();

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-tags'),
        card.textContent
      ].join(' '));
      var year = card.getAttribute('data-year') || '';
      var matchQuery = !query || haystack.indexOf(query) !== -1;
      var matchYear = activeYear === 'all' || year === activeYear;

      card.classList.toggle('is-hidden', !(matchQuery && matchYear));
    });
  }

  searchInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      searchInputs.forEach(function (other) {
        if (other !== input) {
          other.value = input.value;
        }
      });
      applyFilters();
    });
  });

  clearButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      searchInputs.forEach(function (input) {
        input.value = '';
      });
      applyFilters();
    });
  });

  yearButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeYear = button.getAttribute('data-filter-year') || 'all';
      yearButtons.forEach(function (item) {
        item.classList.toggle('active', item === button);
      });
      applyFilters();
    });
  });
})();
