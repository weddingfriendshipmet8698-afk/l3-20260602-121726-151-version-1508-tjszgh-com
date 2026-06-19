export function initMoviePlayer(options) {
  const video = document.getElementById(options.videoId);
  const button = document.getElementById(options.buttonId);
  let ready = false;
  let hls = null;

  if (!video || !button || !options.src) {
    return;
  }

  function attach() {
    if (ready) {
      return;
    }

    ready = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = options.src;
    } else if (options.Hls && options.Hls.isSupported()) {
      hls = new options.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(options.src);
      hls.attachMedia(video);
    } else {
      video.src = options.src;
    }
  }

  function play() {
    attach();
    button.classList.add("is-hidden");
    const attempt = video.play();

    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(function () {
        button.classList.remove("is-hidden");
      });
    }
  }

  button.addEventListener("click", play);

  video.addEventListener("click", function () {
    if (!ready) {
      play();
    }
  });

  window.addEventListener("pagehide", function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
