$(function () {
    const $slider = $('#caregiverSlider');
    const $slides = $slider.find('.slide');
    const $dots = $slider.find('.dot');
    const intervalTime = 5000;
    let current = 0;
    let timer = null;
    let animating = false;

    function restartTextAnimation($slide) {
      const $items = $slide.find('.anim-wrap');
      $items.removeClass('fly-in fly-out fly-in-delay-1 fly-in-delay-2 fly-in-delay-3 fly-in-delay-4');
      void $slide[0].offsetWidth;
      $items.each(function (index) {
        const $el = $(this);
        $el.addClass('fly-in');
        if (index === 0) $el.addClass('fly-in-delay-1');
        if (index === 1) $el.addClass('fly-in-delay-2');
        if (index === 2) $el.addClass('fly-in-delay-3');
        if (index === 3) $el.addClass('fly-in-delay-4');
      });
    }

    function animateOutText($slide) {
      $slide.find('.anim-wrap').removeClass('fly-in fly-in-delay-1 fly-in-delay-2 fly-in-delay-3 fly-in-delay-4').addClass('fly-out');
    }

    function setActive(index) {
      if (animating || index === current) return;
      animating = true;

      const $currentSlide = $slides.eq(current);
      const $nextSlide = $slides.eq(index);

      animateOutText($currentSlide);
      $currentSlide.addClass('leaving').removeClass('active');

      $nextSlide.addClass('active').removeClass('leaving');
      $dots.removeClass('active').eq(index).addClass('active');

      setTimeout(function () {
        $currentSlide.removeClass('leaving');
        restartTextAnimation($nextSlide);
        current = index;
        animating = false;
      }, 700);
    }

    function nextSlide() {
      setActive((current + 1) % $slides.length);
    }

    function prevSlide() {
      setActive((current - 1 + $slides.length) % $slides.length);
    }

    function startAutoPlay() {
      stopAutoPlay();
      timer = setInterval(nextSlide, intervalTime);
    }

    function stopAutoPlay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    $slider.on('mouseenter', stopAutoPlay);
    $slider.on('mouseleave', startAutoPlay);

    $slider.find('.next-btn').on('click', function () {
      nextSlide();
      startAutoPlay();
    });

    $slider.find('.prev-btn').on('click', function () {
      prevSlide();
      startAutoPlay();
    });

    $dots.on('click', function () {
      const index = $(this).index();
      setActive(index);
      startAutoPlay();
    });

    restartTextAnimation($slides.eq(0));
    startAutoPlay();
  });