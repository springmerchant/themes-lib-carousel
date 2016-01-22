import $ from 'jquery';
import imagesLoaded from 'imagesloaded';
import trend from 'jquery-trend';
import revealer from 'jquery-revealer';

export default class Carousel {
  constructor(options) {
    this.$el = $(options.el);

    this.currentIndex = 0;
    this.targetIndex = 0;
    this.isPlaying = false;
    this.isChanging = false;
    this.animationDirection;
    this.autoplay;

    this.options = $.extend({
      delay: 3000,
      pagination: false,
      autoplay: true,
      dotText: false,
      setHeight: true,
    }, options);

    this.$items = this.$el.find('.carousel-item');

    this._initPagination();
    this._bindEvents();
    this._displayNavigation();

    if (this.options.setHeight) {
      this._setCarouselHeight();
    }

    if (this.options.autoplay) {
      this.play();
    }

    // Force show first slide
    this.$items.first().revealer('show', true);
  }

  /**
   * Start slideshow.
   */
  play() {
    if (this.isPlaying) {
      return;
    }

    this.isPlaying = true;
    this._startLoop();
  }

  /**
   * Pause slideshow.
   */
  pause() {
    if (!this.isPlaying) {
      return;
    }

    this.isPlaying = false;
    this._pauseLoop();
  }

  /**
   * Select the previous slide.
   */
  previousSlide() {
    this._resetInterval();
    this._previousSlide();
  }

  /**
   * Select the next slide.
   */
  nextSlide() {
    this._resetInterval();
    this._nextSlide();
  }

  /**
   * Select the previous slide.
   */
  _previousSlide() {
    const newIndex = (this.targetIndex === 0)
      ? this.$items.length - 1
      : this.targetIndex - 1;
    this.changeSlide(newIndex, 'right');
  }

  /**
   * Select the next slide.
   */
  _nextSlide() {
    const newIndex = (this.targetIndex + 1 === this.$items.length)
      ? 0
      : this.targetIndex + 1;
    this.changeSlide(newIndex, 'left');
  }

  /**
   * Select a specific slide.
   *
   * @param {Number} targetIndex
   *        The index of the slide to select.
   *
   * @param {String} animationDirection = 'auto'
   *        A class name that will be applied to the slide while animating. This
   *        allows you to animate specific slides differently.
   *        The value will be prepended with `animating-`.
   *        Defaults to `left` or `right`.
   */
  changeSlide(targetIndex, animationDirection = 'auto') {
    // Calculate animation direction
    let direction = null;

    if (animationDirection === 'auto') {
      direction = (targetIndex > this.currentIndex)
        ? 'animating-left'
        : 'animating-right';
    } else {
      direction = `animating-${animationDirection}`;
    }

    // Update state
    this._updatePagination(targetIndex);
    this.targetIndex = targetIndex;
    this.animationDirection = direction;
    this._updateSlideState();
  }

  /**
   * @private
   * Set up event handlers.
   */
  _bindEvents() {
    this.$el.on('click', '.carousel-navigation-item', (e) => {
      if ($(e.currentTarget).hasClass('carousel-next')) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    });

    this.$el.on('click', '[data-carousel-pagination-item]', (e) => {
      e.preventDefault();
      const index = parseInt($(e.currentTarget).data('slide'), 10);
      this.changeSlide(index);
    });

    this.$el.on('mouseenter', () => {
      if (this.isPlaying) {
        this._pauseLoop();
      }
    });

    this.$el.on('mouseleave', () => {
      if (this.isPlaying) {
        this._startLoop();
      }
    });

    $(window).on('resize', () => {
      if (this.options.setHeight) {
        this._setCarouselHeight();
      }
    });
  }

  /**
   * @private
   * Update the carousel wrapper height to match the largest slide.
   */
  _setCarouselHeight() {
    this.$el.trigger('carousel-resize');

    this.$el.imagesLoaded(() => {
      let carouselHeight = 0;

      for (let i = 0; i < this.$items.length; i++) {
        const itemHeight = this.$items.eq(i).height();
        carouselHeight = Math.max(carouselHeight, itemHeight);
      }

      this.$el.height(carouselHeight);
      this.$el.trigger('carousel-resized');
    });
  }

  /**
   * @private
   * Show navigation element.
   */
  _displayNavigation() {
    this.$el.find('.carousel-navigation').addClass('visible');
  }

  /**
   * @private
   * Create pagination elements.
   */
  _initPagination() {
    // skip if it's not activated
    if (!this.options.pagination) {
      return;
    }

    const $dotsContainer  = $('<div></div>').addClass('carousel-pagination');

    for (let i = 0; i < this.$items.length; i++) {
      const dotText = (this.options.dotText ? this.options.dotText : i);
      $(`<a>${dotText}</a>`)
        .addClass('carousel-pagination-item')
        .attr('data-slide', i)
        .on('click', (e) => {
          e.preventDefault();
          this.changeSlide(i);
        })
        .appendTo($dotsContainer);
    }

    this.$el.append($dotsContainer);
    this._updatePagination(this.currentIndex);
  }

  /**
   * @private
   * Update pagination elements to match selected slide.
   */
  _updatePagination(index) {
    this.$el
      .find('.carousel-pagination-item')
      .removeClass('active')
      .filter(`[data-slide=${index}]`)
      .addClass('active');
  }

  /**
   * @private
   * Select the slide currently set as the target.
   */
  _updateSlideState() {
    // Skip if we are already at our target slide
    if (this.currentIndex === this.targetIndex) {
      return;
    }

    // Skip this if currently animating. This function calls itself after
    // animating to handle this case.
    if (this.isChanging) {
      return;
    }

    this.isChanging = true;

    // Save current and target index so we can pass them to our changed event
    const currentIndex = this.currentIndex;
    const targetIndex = this.targetIndex;

    // Trigger change event
    this.$el.trigger('carousel-change', {
      from: currentIndex,
      to: targetIndex,
    });

    // Hide current slide
    this.$items.eq(currentIndex)
      .one('revealer-animating', (e) => {
        $(e.currentTarget).addClass(this.animationDirection);
      })
      .one('revealer-hide', (e) => {
        $(e.currentTarget).removeClass(this.animationDirection);
      })
      .revealer('hide');

    // Show target slide
    this.$items.eq(targetIndex)
      .one('revealer-animating', (e) => {
        $(e.currentTarget).addClass(this.animationDirection);
      })
      .one('revealer-show', (e) => {
        $(e.currentTarget).removeClass(this.animationDirection);

        // Trigger changed event
        this.$el.trigger('carousel-changed', {
          from: currentIndex,
          to: targetIndex,
        });

        // Update state
        this.currentIndex = targetIndex;
        this.isChanging = false;
        this._clearAnimationClasses();
        this._updateSlideState();
      })
      .revealer('show');
  }

  /**
   * @private
   * Removes all classes starting with `animating`.
   *
   * This is needed to clean up after when the user rapidly changes slides.
   */
  _clearAnimationClasses() {
    for (let i = 0; i < this.$items.length; i++) {
      const el = this.$items[i];

      const classes = el.className.split(' ').filter((c) => {
        return c.lastIndexOf('animating', 0) !== 0;
      });

      el.className = $.trim(classes.join(' '));
    }
  }

  /**
   * @private
   * Clear and restart carousel timer.
   */
  _resetInterval() {
    clearInterval(this.autoplay);
    this.autoplay = setInterval(() => {
      this.nextSlide();
    }, this.options.delay);
  }

  /**
   * @private
   * Start slideshow timer.
   */
  _startLoop() {
    this.autoplay = setInterval(() => {
      this.nextSlide();
    }, this.options.delay);

    this.$el.trigger('carousel-play');
  }

  /**
   * @private
   * Stop slideshow timer.
   */
  _pauseLoop() {
    clearInterval(this.autoplay);
    this.$el.trigger('carousel-pause');
  }
}
