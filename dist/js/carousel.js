import $ from 'jquery';
import imagesLoaded from 'imagesloaded';
import trend from 'jquery-trend';

export default class Carousel {
  constructor(options) {
    super();
    this.$el = $(options.el);

    this.currentIndex = 0;

    this.options = $.extend({
      delay: 4000
    }, options);

    this.$items = this.$el.find('.carousel-item');

    this.bindEvents();
    this.setCarouselHeight();
    this.startLoop();
  }

  bindEvents() {
    this.$el.on('click', this.$el.find('.carousel-navigation-item'), (e) => {
      if ($(e.target).hasClass('carousel-next')) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    });

    this.$el.on('mouseenter', () => {
      this.pauseLoop();
    });

    this.$el.on('mouseleave', () => {
      this.startLoop();
    });

    $(window).on('resize', () => {
      this.setCarouselHeight();
    });
  }

  setCarouselHeight() {
    this.$el.imagesLoaded(() => {
      let carouselHeight = 0;

      for (let i of this.$items.length) {
        let itemHeight = this.$items.eq(i).height();

        carouselHeight = Math.max(carouselHeight, itemHeight);
      }

      this.$el.height(carouselHeight);
    });
  }

  previousSlide() {
    // to the end if we're on the first slide, otherwise decrement
    let newIndex = (this.currentIndex === 0) ? this.$items.length - 1 : this.currentIndex - 1;

    this.showNewSlide(newIndex);
  }

  nextSlide() {
    // back to zero if we're on the last slide, otherwise increment
    let newIndex = (this.currentIndex + 1 === this.$items.length) ? 0 : this.currentIndex + 1;

    this.showNewSlide(newIndex);
  }

  showNewSlide(newIndex) {

    // determine if we're going left or right
    let direction = (newIndex > this.currentIndex) ? 'left' : 'right';

    let $activeSlide = $('.carousel-item.active');
    let $nextSlide = $(this.$items[newIndex]);

    $nextSlide[0].offsetWidth; // force reflow
    $activeSlide.addClass(direction);
    $nextSlide.addClass(direction);

    $nextSlide.one('trend', function() {
      $nextSlide.removeClass(direction).addClass('active');
      $activeSlide.removeClass(`active ${direction}`);
    });

    this.currentIndex = newIndex;
  }

  startLoop() {
    const delay = this.options.delay;

    this.autoplay = setInterval(() => {
      this.nextSlide();
    }, delay);
  }

  pauseLoop() {
    clearInterval(this.autoplay);
  }
}
