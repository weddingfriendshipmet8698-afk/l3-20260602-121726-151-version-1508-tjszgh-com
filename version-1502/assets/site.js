(function () {
    var menuButton = document.querySelector('.menu-button');
    var mobilePanel = document.querySelector('.mobile-panel');
    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-controls button'));
    var current = 0;
    function showSlide(index) {
        if (!slides.length) return;
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('active', i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === current);
        });
    }
    if (slides.length) {
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                showSlide(i);
            });
        });
        var prev = document.querySelector('[data-hero-prev]');
        var next = document.querySelector('[data-hero-next]');
        if (prev) prev.addEventListener('click', function () { showSlide(current - 1); });
        if (next) next.addEventListener('click', function () { showSlide(current + 1); });
        setInterval(function () { showSlide(current + 1); }, 5200);
    }

    function normalize(value) {
        return (value || '').toString().toLowerCase().trim();
    }
    function applyFilters(scope) {
        var root = scope || document;
        var input = root.querySelector('[data-filter-input]');
        var year = root.querySelector('[data-filter-year]');
        var type = root.querySelector('[data-filter-type]');
        var cards = Array.prototype.slice.call(root.querySelectorAll('[data-title]'));
        var empty = root.querySelector('.empty-state');
        function run() {
            var q = normalize(input && input.value);
            var y = normalize(year && year.value);
            var t = normalize(type && type.value);
            var shown = 0;
            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-tags')
                ].join(' '));
                var ok = true;
                if (q && haystack.indexOf(q) === -1) ok = false;
                if (y && normalize(card.getAttribute('data-year')) !== y) ok = false;
                if (t && normalize(card.getAttribute('data-type')) !== t) ok = false;
                card.style.display = ok ? '' : 'none';
                if (ok) shown += 1;
            });
            if (empty) empty.style.display = shown ? 'none' : 'block';
        }
        [input, year, type].forEach(function (el) {
            if (el) el.addEventListener('input', run);
            if (el) el.addEventListener('change', run);
        });
        var params = new URLSearchParams(location.search);
        if (input && params.get('q')) input.value = params.get('q');
        run();
    }
    Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]')).forEach(function (scope) {
        applyFilters(scope);
    });

    function startVideo(player) {
        var video = player.querySelector('video');
        var cover = player.querySelector('.play-cover');
        if (!video) return;
        var src = video.getAttribute('data-hls');
        if (!src) return;
        if (!video.getAttribute('data-loaded')) {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(src);
                hls.attachMedia(video);
                player._hls = hls;
            } else {
                video.src = src;
            }
            video.setAttribute('data-loaded', '1');
        }
        if (cover) cover.classList.add('is-hidden');
        video.controls = true;
        var play = video.play();
        if (play && play.catch) play.catch(function () {});
    }
    Array.prototype.slice.call(document.querySelectorAll('.player-box')).forEach(function (player) {
        var cover = player.querySelector('.play-cover');
        var video = player.querySelector('video');
        if (cover) cover.addEventListener('click', function () { startVideo(player); });
        if (video) video.addEventListener('click', function () {
            if (!video.getAttribute('data-loaded')) startVideo(player);
        });
    });
})();
