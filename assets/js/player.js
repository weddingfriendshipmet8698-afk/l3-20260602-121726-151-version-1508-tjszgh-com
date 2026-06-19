(function () {
  var wrap = document.querySelector('[data-player-wrap]');
  var video = document.querySelector('[data-player-video]');
  var button = document.querySelector('[data-player-button]');

  if (!wrap || !video || !button) {
    return;
  }

  var source = video.getAttribute('data-src');
  var ready = false;
  var hlsInstance = null;

  function startPlayer() {
    if (!source) {
      return;
    }

    wrap.classList.add('is-playing');

    if (ready) {
      video.play().catch(function () {});
      return;
    }

    ready = true;

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        capLevelToPlayerSize: true,
        enableWorker: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
      hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal && hlsInstance) {
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hlsInstance.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hlsInstance.recoverMediaError();
          }
        }
      });
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.addEventListener('loadedmetadata', function () {
        video.play().catch(function () {});
      }, { once: true });
      return;
    }

    video.src = source;
    video.play().catch(function () {});
  }

  button.addEventListener('click', startPlayer);
  wrap.addEventListener('click', function (event) {
    if (event.target === video && !ready) {
      startPlayer();
    }
  });
})();
