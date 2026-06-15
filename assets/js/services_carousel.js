(function ($) {
  const slidesData = [
    { title: 'Elderly Care Service', image: 'assets/media/images/service-1.jpg', text: 'Leverage agile frameworks to provide a robust synopsis for high level overviews approaches.' },
    { title: '24Hr/7 Days Support', image: 'assets/media/images/service-2.jpg', text: 'Leverage agile frameworks to provide a robust synopsis for high level overviews approaches.' },
    { title: 'Medical Care', image: 'assets/media/images/service-3.jpg', text: 'Leverage agile frameworks to provide a robust synopsis for high level overviews approaches.' },
    { title: 'Personal Care', image: 'assets/media/images/service-4.jpg', text: 'Leverage agile frameworks to provide a robust synopsis for high level overviews approaches.' },
    { title: 'Companionship', image: 'assets/media/images/service-5.jpg', text: 'Leverage agile frameworks to provide a robust synopsis for high level overviews approaches.' },
    { title: 'Nursing Assistance', image: 'assets/media/images/service-6.jpg', text: 'Leverage agile frameworks to provide a robust synopsis for high level overviews approaches.' },
    { title: 'Home Support', image: 'assets/media/images/service-7.jpg', text: 'Leverage agile frameworks to provide a robust synopsis for high level overviews approaches.' }
  ];

  const $carousel = $('.service-carousel');
  const $track = $('#servicesCarouselTrack');
  const $prev = $('.service-carousel__control--prev');
  const $next = $('.service-carousel__control--next');

  const state = {
    visible: 4,
    cloneCount: 4,
    realIndex: 0,
    currentPosition: 4,
    isAnimating: false,
    isPaused: false,
    autoplay: null,
    resizeTimer: null,
    rebuilding: false,
    touchStartX: 0,
    touchEndX: 0
  };

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w >= 1280) return 4;
    if (w >= 768) return 2;
    return 1;
  }

  function cardMarkup(item) {
    return `
          <div class="service-carousel__slide">
            <article class="service-carousel__card">
              <img class="service-carousel__image" src="${item.image}" alt="${item.title}" loading="lazy" decoding="async">
              <div class="service-carousel__content">
                <h3 class="service-carousel__card-title">${item.title}</h3>
                <p class="service-carousel__card-text">${item.text}</p>
              </div>
            </article>
          </div>
        `;
  }

  function setTransform(animate) {
    if (animate === false) {
      $track.css('transition', 'none');
    } else {
      $track.css('transition', 'transform 760ms cubic-bezier(0.22, 1, 0.36, 1)');
    }
    const slideWidth = 100 / state.visible;
    const translate = -(state.currentPosition * slideWidth);
    $track.css('transform', `translate3d(${translate}%,0,0)`);
    if (animate === false) {
      void $track[0].offsetHeight;
      $track.css('transition', 'transform 760ms cubic-bezier(0.22, 1, 0.36, 1)');
    }
  }

  function buildTrack() {
    state.visible = getVisibleCount();
    state.cloneCount = Math.min(state.visible, slidesData.length);

    const headClones = slidesData.slice(-state.cloneCount).map(cardMarkup).join('');
    const originals = slidesData.map(cardMarkup).join('');
    const tailClones = slidesData.slice(0, state.cloneCount).map(cardMarkup).join('');
    $track.html(headClones + originals + tailClones);

    const basis = (100 / state.visible) + '%';
    $track.children('.service-carousel__slide').css({
      'flex-basis': basis,
      'max-width': basis
    });

    state.currentPosition = state.cloneCount + state.realIndex;
    setTransform(false);
  }

  function normalizeAfterTransition() {
    const max = state.cloneCount + slidesData.length;
    const min = state.cloneCount;

    if (state.currentPosition >= max) {
      state.currentPosition -= slidesData.length;
      setTransform(false);
    } else if (state.currentPosition < min) {
      state.currentPosition += slidesData.length;
      setTransform(false);
    }
    state.isAnimating = false;
  }

  function next() {
    if (state.isAnimating) return;
    state.isAnimating = true;
    state.realIndex = (state.realIndex + 1) % slidesData.length;
    state.currentPosition += 1;
    setTransform(true);
  }

  function prev() {
    if (state.isAnimating) return;
    state.isAnimating = true;
    state.realIndex = (state.realIndex - 1 + slidesData.length) % slidesData.length;
    state.currentPosition -= 1;
    setTransform(true);
  }

  function startAutoplay() {
    stopAutoplay();
    state.autoplay = window.setInterval(function () {
      if (!state.isPaused && !state.rebuilding) {
        next();
      }
    }, 4000);
  }

  function stopAutoplay() {
    if (state.autoplay) {
      window.clearInterval(state.autoplay);
      state.autoplay = null;
    }
  }

  function rebuild() {
    if (state.rebuilding) return;
    state.rebuilding = true;

    const oldIndex = state.realIndex;
    buildTrack();
    state.realIndex = oldIndex;
    state.currentPosition = state.cloneCount + state.realIndex;
    setTransform(false);
    state.rebuilding = false;
    state.isAnimating = false;
  }

  function scheduleRebuild() {
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(rebuild, 120);
  }

  $next.on('click', next);
  $prev.on('click', prev);

  $track.on('transitionend webkitTransitionEnd oTransitionEnd', function (e) {
    if (e.target !== $track[0]) return;
    normalizeAfterTransition();
  });

  $carousel.on('mouseenter focusin', function () { state.isPaused = true; });
  $carousel.on('mouseleave focusout', function () { state.isPaused = false; });

  $carousel.on('touchstart pointerdown', function (e) {
    const oe = e.originalEvent.touches ? e.originalEvent.touches[0] : e.originalEvent;
    state.touchStartX = oe.clientX || 0;
    state.touchEndX = state.touchStartX;
    state.isPaused = true;
  });

  $carousel.on('touchmove pointermove', function (e) {
    const oe = e.originalEvent.touches ? e.originalEvent.touches[0] : e.originalEvent;
    if (typeof oe.clientX === 'number') state.touchEndX = oe.clientX;
  });

  $carousel.on('touchend pointerup pointercancel', function () {
    const diff = state.touchStartX - state.touchEndX;
    const threshold = 50;
    state.isPaused = false;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) next();
      else prev();
    }
  });

  $(window).on('resize orientationchange', scheduleRebuild);
  $(window).on('blur', function () { state.isPaused = true; });
  $(window).on('focus', function () { state.isPaused = false; });

  buildTrack();
  startAutoplay();

})(jQuery);