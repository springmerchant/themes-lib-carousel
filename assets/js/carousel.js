import $ from 'jquery';
import imagesLoaded from 'imagesloaded';
import trend from 'jquery-trend';

export default class Carousel {

  constructor(options) {
    super();
    this.$el = $(options.el);

    this.options = $.extend({
      delay: 4000
    }, options);

    this.$item = this.$el.find('.carousel-item');

    this.bindEvents();
    this.setCarouselHeight();
    this.startLoop();
  }

  bindEvents() {
    this.$el.on('click', this.$el.find('.carousel-navigation-item'), (e) => {
      if ($(e.target).hasClass('next')) {
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

      for (let i of this.$item.length) {
        let $itemHeight = this.$item.eq(i).height();

        carouselHeight = Math.max(carouselHeight, $itemHeight);
      }

      this.$el.height(carouselHeight);
    });
  }

  previousSlide() {
    this.showNewSlide('prev');
  }

  nextSlide() {
    this.showNewSlide('next');
  }

  showNewSlide(type) {
    let direction = (type === 'next') ? 'left' : 'right';
    let fallback = (type === 'next') ? 'first' : 'last';

    let activeSlide = $('.carousel-item.active');
    let nextSlide = (activeSlide[type]().hasClass('carousel-item')) ? activeSlide[type]() : this.$item[fallback]();

    if (!nextSlide.length) {
      nextSlide = this.$item[fallback]();
    }

    nextSlide.addClass(type);
    nextSlide[0].offsetWidth; // force reflow
    activeSlide.addClass(direction);
    nextSlide.addClass(direction);

    nextSlide.one('trend', function() {
      nextSlide.removeClass([type, direction].join(' ')).addClass('active');
      activeSlide.removeClass(['active', direction].join(' '));
    });
  }

  startLoop() {
    let delay = this.options.carouselDelay * 1000;

    this.autoplay = setInterval(() => {
      this.nextSlide();
    }, delay);
  }

  pauseLoop() {
    clearInterval(this.autoplay);
  }
}
