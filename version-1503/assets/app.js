(function () {
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  let currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === currentSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5200);
  }

  const filterRoot = document.querySelector('[data-filter-root]');
  if (filterRoot) {
    const input = filterRoot.querySelector('[data-filter-input]');
    const year = filterRoot.querySelector('[data-filter-year]');
    const type = filterRoot.querySelector('[data-filter-type]');
    const cards = Array.from(document.querySelectorAll('[data-title]'));
    const empty = document.querySelector('[data-empty]');

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilter() {
      const keyword = normalize(input ? input.value : '');
      const yearValue = year ? year.value : '';
      const typeValue = normalize(type ? type.value : '');
      let visible = 0;

      cards.forEach(function (card) {
        const haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-year')
        ].join(' '));
        const yearMatched = !yearValue || card.getAttribute('data-year') === yearValue;
        const typeMatched = !typeValue || haystack.indexOf(typeValue) !== -1;
        const keywordMatched = !keyword || haystack.indexOf(keyword) !== -1;
        const matched = yearMatched && typeMatched && keywordMatched;
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    }

    [input, year, type].forEach(function (node) {
      if (node) {
        node.addEventListener('input', applyFilter);
        node.addEventListener('change', applyFilter);
      }
    });
  }
})();
