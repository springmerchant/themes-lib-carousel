import $ from 'jquery';
import imagesLoaded from 'imagesloaded';
import trend from 'jquery-trend';
import revealer from 'jquery-revealer';

export default class Carousel {
  constructor(options) {
    super();
    this.$el = $(options.el);

    this.currentIndex = 0;

    this.options = $.extend({
      delay: 4000,
      pagination: false
    }, options);

    this.$items = this.$el.find('.carousel-item');

    this.initPagination();
    this.bindEvents();
    this.setCarouselHeight();
    this.startLoop();

    // Force show first slide
    this.$items.first().revealer('show', true);
  }

  bindEvents() {
    this.$el.on('click', '.carousel-navigation-item', (e) => {
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

  initPagination() {
    // skip if it's not activated
    if (!this.options.pagination) {
      return;
    }

    const $dotsContainer  = $('<div></div>').addClass('carousel-pagination');

    for (let i of this.$items.length) {
      let $dot = $(`<a>${i}</a>`).addClass('carousel-pagination-item').attr('data-slide', i);
      $dot.bind('click', (e) => {
        e.preventDefault();
        this.changeSlide(i);
      });
      $dotsContainer.append($dot);
    }

    this.$el.append($dotsContainer);
    this.updatePagination(this.currentIndex);
  }

  updatePagination(index) {
    this.$el.find('.carousel-pagination-item').removeClass('active').filter(`[data-slide=${index}]`).addClass('active');
  }

  previousSlide() {
    // to the end if we're on the first slide, otherwise decrement
    const newIndex = (this.currentIndex === 0) ? this.$items.length - 1 : this.currentIndex - 1;

    this.changeSlide(newIndex);
  }

  nextSlide() {
    // back to zero if we're on the last slide, otherwise increment
    const newIndex = (this.currentIndex + 1 === this.$items.length) ? 0 : this.currentIndex + 1;

    this.changeSlide(newIndex);
  }

  changeSlide(targetIndex) {
    if (this.currentIndex === targetIndex) {
      return;
    }

    const direction = (targetIndex > this.currentIndex)
      ? 'animating-left'
      : 'animating-right';

    // Change slides
    this.$items.eq(this.currentIndex)
      .one('revealer-animating', (e) => {
        $(e.currentTarget).addClass(direction);
      })
      .one('revealer-hide', (e) => {
        $(e.currentTarget).removeClass(direction);
      })
      .revealer('hide');

    this.$items.eq(targetIndex)
      .one('revealer-animating', (e) => {
        $(e.currentTarget).addClass(direction);
      })
      .one('revealer-show', (e) => {
        $(e.currentTarget).removeClass(direction);
      })
      .revealer('show');

    // Update state
    this.updatePagination(targetIndex);
    this.currentIndex = targetIndex;
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
