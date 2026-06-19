(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initMenu() {
    var toggle = qs('[data-menu-toggle]');
    if (!toggle) {
      return;
    }
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
    });
  }

  function initHero() {
    var hero = qs('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = qsa('[data-hero-slide]', hero);
    var dots = qsa('[data-hero-dot]', hero);
    var next = qs('[data-hero-next]', hero);
    var prev = qs('[data-hero-prev]', hero);
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function reset(nextIndex) {
      if (timer) {
        window.clearInterval(timer);
      }
      show(nextIndex);
      start();
    }

    if (next) {
      next.addEventListener('click', function () {
        reset(index + 1);
      });
    }
    if (prev) {
      prev.addEventListener('click', function () {
        reset(index - 1);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        reset(i);
      });
    });
    show(0);
    start();
  }

  function initFilters() {
    var box = qs('[data-filter-box]');
    if (!box) {
      return;
    }
    var input = qs('[data-search-input]');
    var typeSelect = qs('[data-type-select]');
    var yearSelect = qs('[data-year-select]');
    var cards = qsa('[data-card]');

    function update() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var type = typeSelect ? typeSelect.value : '';
      var year = yearSelect ? yearSelect.value : '';
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags')).toLowerCase();
        var cardType = card.getAttribute('data-type');
        var cardYear = card.getAttribute('data-year');
        var visible = true;
        if (keyword && text.indexOf(keyword) === -1) {
          visible = false;
        }
        if (type && cardType !== type) {
          visible = false;
        }
        if (year && cardYear !== year) {
          visible = false;
        }
        card.classList.toggle('hidden-by-filter', !visible);
      });
    }

    [input, typeSelect, yearSelect].forEach(function (el) {
      if (el) {
        el.addEventListener('input', update);
        el.addEventListener('change', update);
      }
    });
  }

  function initPlayer() {
    var wrap = qs('[data-player]');
    if (!wrap) {
      return;
    }
    var video = qs('video', wrap);
    var cover = qs('[data-play-button]', wrap);
    if (!video) {
      return;
    }
    var streamUrl = video.getAttribute('data-play');
    var mediaReady = false;

    function attachMedia() {
      if (mediaReady) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
      mediaReady = true;
    }

    function startPlay() {
      attachMedia();
      video.controls = true;
      if (cover) {
        cover.classList.add('is-hidden');
      }
      var playPromise = video.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener('click', startPlay);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        startPlay();
      } else {
        video.pause();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHero();
    initFilters();
    initPlayer();
  });
})();
