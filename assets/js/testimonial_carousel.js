$(function () {
  const testimonials = [
    {
      name: "Mark John",
      role: "CEO Falcon",
      image: "https://i.pravatar.cc/120?img=12",
      text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
    },
    {
      name: "Mark John",
      role: "CEO Falcon",
      image: "https://i.pravatar.cc/120?img=13",
      text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
    },
    {
      name: "Mark John",
      role: "CEO Falcon",
      image: "https://i.pravatar.cc/120?img=14",
      text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
    },
    {
      name: "Mark John",
      role: "CEO Falcon",
      image: "https://i.pravatar.cc/120?img=15",
      text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
    },
    {
      name: "Mark John",
      role: "CEO Falcon",
      image: "https://i.pravatar.cc/120?img=16",
      text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
    }
  ];
  const config = {
    breakpoints: {
      tablet: 768,
      desktop: 1024
    },
    slidesToShow: {
      mobile: 1,
      tablet: 2,
      desktop: 2
    },
    autoplay: {
      mobile: true,
      tablet: true,
      desktop: true
    },
    autoplaySpeed: 3500,
    transitionMs: 700,
    step: 1
  };
  const $section = $('.client-testimonial-section');
  const $track = $('.testimonial-carousel__track');
  const $dots = $('.testimonial-carousel__dots');
  const state = {
    device: null,
    visible: 1,
    total: testimonials.length,
    cloneCount: 1,
    currentIndex: 0,
    currentPosition: 0,
    animating: false,
    timer: null
  };
  function getDevice() {
    const width = window.innerWidth;
    if (width >= config.breakpoints.desktop) {
      return 'desktop';
    }
    if (width >= config.breakpoints.tablet) {
      return 'tablet';
    }
    return 'mobile';
  }
  function getVisibleCount(device) {
    return config.slidesToShow[device] || 1;
  }
  function canAutoplay(device) {
    return !!config.autoplay[device];
  }
  function buildCard(item) {
    return `
            <div class="testimonial-carousel__slide">
                <div class="testimonial-carousel__card px-3">
                    <div class="testimonial-carousel__bubble bg-white rounded-[6px] px-[35px] py-[40px] lg:px-[30px] lg:py-[30px]">
                        <p class="font-[Poppins]
                                   text-[#808080]
                                   text-[16px]
                                   lg:text-[16px]
                                   font-normal
                                   leading-[1.6]">
                            ${item.text}
                        </p>
                    </div>
                    <div class="flex items-center mt-[30px]">
                        <img src="${item.image}" alt="${item.name}"
                            class="w-[82px] h-[82px] rounded-full object-cover flex-shrink-0">
                        <div class="ml-[35px]">
                            <div class="flex flex-wrap items-center">
                                <h4 class="font-[Cormorant_Garamond]
                                           text-white
                                           font-bold
                                           text-[16px]
                                           lg:text-[20px]
                                           leading-none">
                                    ${item.name}
                                </h4>
                                <span class="ml-3
                                             text-white
                                             text-[12px]
                                             lg:text-[12px]
                                             font-medium">
                                    – ${item.role}
                                </span>
                            </div>
                            <div class="flex gap-3 mt-5">
                                <i class="fas fa-star text-[#f3ebe5] text-[20px]"></i>
                                <i class="fas fa-star text-[#f3ebe5] text-[20px]"></i>
                                <i class="fas fa-star text-[#f3ebe5] text-[20px]"></i>
                                <i class="fas fa-star text-[#f3ebe5] text-[20px]"></i>
                                <i class="fas fa-star text-[#f3ebe5] text-[20px]"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }
  function renderDots() {
    const dotsHtml = testimonials.map((_, index) => {
      return `
                <button
                    type="button"
                    class="testimonial-carousel__dot ${index === state.currentIndex ? 'active' : ''}"
                    data-index="${index}"
                    aria-label="Go to testimonial ${index + 1}">
                </button>
            `;
    }).join('');
    $dots.html(dotsHtml);
  }
  function renderTrack() {
    const beforeClones = testimonials.slice(-state.cloneCount);
    const afterClones = testimonials.slice(0, state.cloneCount);
    const slides = [...beforeClones, ...testimonials, ...afterClones];
    const totalSlides = slides.length;
    $track.html(slides.map(buildCard).join(''));
    $track.css({
      width: `calc(100% * ${totalSlides} / ${state.visible})`
    });
    $track.children('.testimonial-carousel__slide').css({
      flex: `0 0 calc(100% / ${totalSlides})`,
      maxWidth: `calc(100% / ${totalSlides})`
    });
  }
  function setPosition(animate) {
    const totalSlides = $track.children().length;
    const offset = (state.currentPosition * 100) / totalSlides;
    if (animate) {
      $track.css('transition', `transform ${config.transitionMs}ms cubic-bezier(.65, .05, .36, 1)`);
    } else {
      $track.css('transition', 'none');
    }
    $track.css('transform', `translate3d(-${offset}%, 0, 0)`);
    if (!animate) {
      void $track[0].offsetWidth;
      $track.css('transition', `transform ${config.transitionMs}ms cubic-bezier(.65, .05, .36, 1)`);
    }
  }
  function syncDots() {
    $dots.find('.testimonial-carousel__dot')
      .removeClass('active')
      .attr('aria-current', 'false');
    $dots.find(`.testimonial-carousel__dot[data-index="${state.currentIndex}"]`)
      .addClass('active')
      .attr('aria-current', 'true');
  }
  function clearAutoplay() {
    if (state.timer) {
      clearInterval(state.timer);
      state.timer = null;
    }
  }
  function startAutoplay() {
    clearAutoplay();
    if (!canAutoplay(state.device) || state.total <= 1) {
      return;
    }
    state.timer = setInterval(nextSlide, config.autoplaySpeed);
  }
  function nextSlide() {
    if (state.animating || state.total <= 1) return;
    state.animating = true;
    state.currentIndex = (state.currentIndex + config.step) % state.total;
    state.currentPosition += config.step;
    setPosition(true);
    syncDots();
  }
  function goToSlide(index) {
    if (state.animating || index === state.currentIndex) return;
    state.currentIndex = index;
    state.currentPosition = state.cloneCount + index;
    setPosition(true);
    syncDots();
  }
  function rebuildCarousel(keepIndex = true) {
    state.device = getDevice();
    state.visible = getVisibleCount(state.device);
    state.cloneCount = Math.min(state.visible, state.total);
    if (!keepIndex) {
      state.currentIndex = 0;
    } else {
      state.currentIndex = Math.min(state.currentIndex, state.total - 1);
    }
    state.currentPosition = state.cloneCount + state.currentIndex;
    renderTrack();
    renderDots();
    setPosition(false);
    syncDots();
    startAutoplay();
  }
  $dots.on('click', '.testimonial-carousel__dot', function () {
    const index = Number($(this).data('index'));
    goToSlide(index);
  });
  $track.on('transitionend webkitTransitionEnd oTransitionEnd', function (e) {
    if (e.target !== this) return;
    const maxRealPosition = state.cloneCount + state.total;
    if (state.currentPosition >= maxRealPosition) {
      state.currentPosition = state.cloneCount;
      setPosition(false);
    } else if (state.currentPosition < state.cloneCount) {
      state.currentPosition = state.cloneCount + state.total - 1;
      setPosition(false);
    }
    state.animating = false;
  });
  $section.on('mouseenter focusin', function () {
    // clearAutoplay();
  });
  $section.on('mouseleave focusout', function () {
    startAutoplay();
  });
  let resizeTimer = null;
  $(window).on('resize orientationchange', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      const previousDevice = state.device;
      const currentDevice = getDevice();
      if (previousDevice !== currentDevice) {
        rebuildCarousel(true);
      }
    }, 120);
  });
  rebuildCarousel(true);
});