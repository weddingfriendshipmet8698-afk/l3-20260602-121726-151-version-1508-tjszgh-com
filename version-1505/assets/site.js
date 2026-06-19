(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    var showSlide = function (index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    };

    var nextSlide = function () {
      showSlide(current + 1);
    };

    var start = function () {
      timer = window.setInterval(nextSlide, 5000);
    };

    var restart = function () {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    };

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        nextSlide();
        restart();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
        restart();
      });
    });

    showSlide(0);
    start();
  }

  var searchInput = document.querySelector('[data-card-search]');
  var yearFilter = document.querySelector('[data-year-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card-list] .movie-card'));

  var applyFilters = function () {
    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var year = yearFilter ? yearFilter.value : '';

    cards.forEach(function (card) {
      var text = [card.dataset.title, card.dataset.region, card.dataset.keywords, card.dataset.year].join(' ').toLowerCase();
      var yearMatch = !year || card.dataset.year === year;
      var textMatch = !query || text.indexOf(query) !== -1;
      card.style.display = yearMatch && textMatch ? '' : 'none';
    });
  };

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', applyFilters);
  }

  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  players.forEach(function (frame) {
    var video = frame.querySelector('video');
    var overlay = frame.querySelector('.play-overlay');
    var state = frame.querySelector('[data-player-state]');
    var stream = frame.getAttribute('data-stream');
    var hls = null;
    var loaded = false;

    var setState = function (text) {
      if (state) {
        state.textContent = text || '';
      }
    };

    var attachStream = function () {
      if (loaded || !video || !stream) {
        return;
      }

      loaded = true;
      setState('加载中');

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setState('');
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              setState('播放暂不可用');
            }
          }
        });
      } else {
        video.src = stream;
      }

      video.addEventListener('loadedmetadata', function () {
        setState('');
      }, { once: true });
    };

    var play = function () {
      attachStream();
      if (overlay) {
        overlay.classList.add('hidden');
      }
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          setState('点击播放');
        });
      }
    };

    if (overlay) {
      overlay.addEventListener('click', play);
    }

    frame.addEventListener('click', function (event) {
      if (event.target === frame) {
        play();
      }
    });

    var jump = document.querySelector('[data-play-jump]');
    if (jump) {
      jump.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(play, 260);
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
