(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-button]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function initHero() {
    var slider = document.querySelector("[data-hero-slider]");
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    var prev = slider.querySelector("[data-hero-prev]");
    var next = slider.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });
    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initSearch() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-card-search]"));
    inputs.forEach(function (input) {
      var selector = input.getAttribute("data-card-search") || "[data-card]";
      var scope = input.closest("section") || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll(selector));
      input.addEventListener("input", function () {
        var keyword = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var source = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
          card.classList.toggle("is-hidden", Boolean(keyword) && source.indexOf(keyword) === -1);
        });
      });
    });
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
    players.forEach(function (player) {
      var video = player.querySelector("video[data-src]");
      var button = player.querySelector("[data-play-button]");
      var status = player.querySelector("[data-player-status]");
      var hls = null;
      var loaded = false;
      if (!video || !button) {
        return;
      }

      function setStatus(text) {
        if (status) {
          status.textContent = text || "";
        }
      }

      function playVideo() {
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {
            setStatus("点击视频区域继续播放");
          });
        }
      }

      function load() {
        var source = video.getAttribute("data-src");
        if (!source) {
          setStatus("当前影片暂时无法播放");
          return;
        }
        button.classList.add("is-hidden");
        setStatus("正在加载影片");
        if (loaded) {
          playVideo();
          return;
        }
        loaded = true;
        if (window.Hls && window.Hls.isSupported && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(source);
          hls.attachMedia(video);
          if (window.Hls.Events && window.Hls.Events.MANIFEST_PARSED) {
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
              setStatus("");
              playVideo();
            });
          } else {
            video.addEventListener("canplay", function () {
              setStatus("");
              playVideo();
            }, { once: true });
          }
          if (window.Hls.Events && window.Hls.Events.ERROR) {
            hls.on(window.Hls.Events.ERROR, function () {
              setStatus("加载失败，请稍后重试");
            });
          }
          return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          video.addEventListener("loadedmetadata", function () {
            setStatus("");
            playVideo();
          }, { once: true });
          return;
        }
        video.src = source;
        video.addEventListener("canplay", function () {
          setStatus("");
          playVideo();
        }, { once: true });
      }

      button.addEventListener("click", load);
      player.addEventListener("click", function (event) {
        if (event.target === video || event.target.closest("button")) {
          return;
        }
        load();
      });
      video.addEventListener("play", function () {
        button.classList.add("is-hidden");
        setStatus("");
      });
      video.addEventListener("error", function () {
        setStatus("加载失败，请稍后重试");
      });
      window.addEventListener("beforeunload", function () {
        if (hls && hls.destroy) {
          hls.destroy();
        }
      });
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initSearch();
    initPlayers();
  });
})();
