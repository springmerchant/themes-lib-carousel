'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _imagesloaded = require('imagesloaded');

var _imagesloaded2 = _interopRequireDefault(_imagesloaded);

var _jqueryTrend = require('jquery-trend');

var _jqueryTrend2 = _interopRequireDefault(_jqueryTrend);

var _jqueryRevealer = require('jquery-revealer');

var _jqueryRevealer2 = _interopRequireDefault(_jqueryRevealer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Carousel = function () {
  function Carousel(options) {
    _classCallCheck(this, Carousel);

    // NPM install seems to not install 'imagesloaded' as a
    // dependency for bc-carousel, so we have to make use of
    //this function so that everything compiles correctly
    _imagesloaded2.default.makeJQueryPlugin(_jquery2.default);

    this.$el = (0, _jquery2.default)(options.el);

    this.currentIndex = 0;
    this.targetIndex = 0;
    this.isPlaying = false;
    this.isChanging = false;
    this.animationDirection;
    this.autoplay;

    this.options = _jquery2.default.extend({
      delay: 3000,
      pagination: false,
      autoplay: true,
      dotText: false,
      setHeight: true,
      pauseOnWindowBlur: false
    }, options);

    this.$items = this.$el.find('.carousel-item');

    this._initPagination();
    this._bindEvents();

    if (this.options.setHeight) {
      this._setCarouselHeight();
    }

    if (this.options.pauseOnWindowBlur) {
      this._bindBlurFocus();
    }

    this._displayNavigation();

    if (this.options.autoplay) {
      this.play();
    }

    // Force show first slide
    this.$items.first().revealer('show', true);
  }

  /**
   * Start slideshow.
   */


  _createClass(Carousel, [{
    key: 'play',
    value: function play() {
      if (this.isPlaying) {
        return;
      }

      this.isPlaying = true;
      this._startLoop();
    }

    /**
     * Pause slideshow.
     */

  }, {
    key: 'pause',
    value: function pause() {
      if (!this.isPlaying) {
        return;
      }

      this.isPlaying = false;
      this._pauseLoop();
    }

    /**
     * Select the previous slide.
     */

  }, {
    key: 'previousSlide',
    value: function previousSlide() {
      if (this.isPlaying) {
        this._resetInterval();
      }
      this._previousSlide();
    }

    /**
     * Select the next slide.
     */

  }, {
    key: 'nextSlide',
    value: function nextSlide() {
      if (this.isPlaying) {
        this._resetInterval();
      }
      this._nextSlide();
    }

    /**
     * Select the previous slide.
     */

  }, {
    key: '_previousSlide',
    value: function _previousSlide() {
      var newIndex = this.targetIndex === 0 ? this.$items.length - 1 : this.targetIndex - 1;
      this.changeSlide(newIndex, 'right');
    }

    /**
     * Select the next slide.
     */

  }, {
    key: '_nextSlide',
    value: function _nextSlide() {
      var newIndex = this.targetIndex + 1 === this.$items.length ? 0 : this.targetIndex + 1;
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

  }, {
    key: 'changeSlide',
    value: function changeSlide(targetIndex) {
      var animationDirection = arguments.length <= 1 || arguments[1] === undefined ? 'auto' : arguments[1];

      // Calculate animation direction
      var direction = null;

      if (animationDirection === 'auto') {
        direction = targetIndex > this.currentIndex ? 'animating-left' : 'animating-right';
      } else {
        direction = 'animating-' + animationDirection;
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

  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this = this;

      this.$el.on('click', '.carousel-navigation-item', function (e) {
        if ((0, _jquery2.default)(e.currentTarget).hasClass('carousel-next')) {
          _this.nextSlide();
        } else {
          _this.previousSlide();
        }
      });

      this.$el.on('click', '[data-carousel-pagination-item]', function (e) {
        e.preventDefault();
        var index = parseInt((0, _jquery2.default)(e.currentTarget).data('slide'), 10);
        _this.changeSlide(index);
      });

      this.$el.on('mouseenter', function () {
        if (_this.isPlaying) {
          _this.pause();
        }
      });

      this.$el.on('mouseleave', function () {
        if (_this.options.autoplay) {
          _this.play();
        }
      });

      (0, _jquery2.default)(window).on('resize', function () {
        if (_this.options.setHeight) {
          _this._setCarouselHeight();
        }
      });
    }

    /**
     * @private
     * Pause and Play carousel on window blur & focus
     */

  }, {
    key: '_bindBlurFocus',
    value: function _bindBlurFocus() {
      window.onblur = this.pause.bind(this);
      window.onfocus = this.play.bind(this);
    }

    /**
     * @private
     * Update the carousel wrapper height to match the largest slide.
     */

  }, {
    key: '_setCarouselHeight',
    value: function _setCarouselHeight() {
      var _this2 = this;

      this.$el.trigger('carousel-resize');

      this.$el.imagesLoaded(function () {
        var carouselHeight = 0;

        for (var i = 0; i < _this2.$items.length; i++) {
          var itemHeight = _this2.$items.eq(i).height();
          carouselHeight = Math.max(carouselHeight, itemHeight);
        }

        _this2.$el.height(carouselHeight);
        _this2.$el.trigger('carousel-resized');
      });
    }

    /**
     * @private
     * Show navigation element.
     */

  }, {
    key: '_displayNavigation',
    value: function _displayNavigation() {
      this.$el.find('.carousel-navigation').addClass('visible');
    }

    /**
     * @private
     * Create pagination elements.
     */

  }, {
    key: '_initPagination',
    value: function _initPagination() {
      var _this3 = this;

      // skip if it's not activated
      if (!this.options.pagination) {
        return;
      }

      var $dotsContainer = (0, _jquery2.default)('<div></div>').addClass('carousel-pagination');

      var _loop = function _loop(i) {
        var dotText = _this3.options.dotText ? _this3.options.dotText : i;
        (0, _jquery2.default)('<a>' + dotText + '</a>').addClass('carousel-pagination-item').attr('data-slide', i).on('click', function (e) {
          e.preventDefault();
          _this3.changeSlide(i);
        }).appendTo($dotsContainer);
      };

      for (var i = 0; i < this.$items.length; i++) {
        _loop(i);
      }

      this.$el.append($dotsContainer);
      this._updatePagination(this.currentIndex);
    }

    /**
     * @private
     * Update pagination elements to match selected slide.
     */

  }, {
    key: '_updatePagination',
    value: function _updatePagination(index) {
      this.$el.find('.carousel-pagination-item').removeClass('active').filter('[data-slide=' + index + ']').addClass('active');
    }

    /**
     * @private
     * Select the slide currently set as the target.
     */

  }, {
    key: '_updateSlideState',
    value: function _updateSlideState() {
      var _this4 = this;

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
      var currentIndex = this.currentIndex;
      var targetIndex = this.targetIndex;

      // Trigger change event
      this.$el.trigger('carousel-change', {
        from: currentIndex,
        to: targetIndex
      });

      // Hide current slide
      this.$items.eq(currentIndex).one('revealer-animating', function (e) {
        (0, _jquery2.default)(e.currentTarget).addClass(_this4.animationDirection);
      }).one('revealer-hide', function (e) {
        (0, _jquery2.default)(e.currentTarget).removeClass(_this4.animationDirection);
      }).revealer('hide');

      // Show target slide
      this.$items.eq(targetIndex).one('revealer-animating', function (e) {
        (0, _jquery2.default)(e.currentTarget).addClass(_this4.animationDirection);
      }).one('revealer-show', function (e) {
        (0, _jquery2.default)(e.currentTarget).removeClass(_this4.animationDirection);

        // Trigger changed event
        _this4.$el.trigger('carousel-changed', {
          from: currentIndex,
          to: targetIndex
        });

        // Update state
        _this4.currentIndex = targetIndex;
        _this4.isChanging = false;
        _this4._clearAnimationClasses();
        _this4._updateSlideState();
      }).revealer('show');
    }

    /**
     * @private
     * Removes all classes starting with `animating`.
     *
     * This is needed to clean up after when the user rapidly changes slides.
     */

  }, {
    key: '_clearAnimationClasses',
    value: function _clearAnimationClasses() {
      for (var i = 0; i < this.$items.length; i++) {
        var el = this.$items[i];

        var classes = el.className.split(' ').filter(function (c) {
          return c.lastIndexOf('animating', 0) !== 0;
        });

        el.className = _jquery2.default.trim(classes.join(' '));
      }
    }

    /**
     * @private
     * Clear and restart carousel timer.
     */

  }, {
    key: '_resetInterval',
    value: function _resetInterval() {
      var _this5 = this;

      clearInterval(this.autoplay);
      this.autoplay = setInterval(function () {
        _this5.nextSlide();
      }, this.options.delay);
    }

    /**
     * @private
     * Start slideshow timer.
     */

  }, {
    key: '_startLoop',
    value: function _startLoop() {
      var _this6 = this;

      clearInterval(this.autoplay);
      this.autoplay = setInterval(function () {
        _this6.nextSlide();
      }, this.options.delay);

      this.$el.trigger('carousel-play');
    }

    /**
     * @private
     * Stop slideshow timer.
     */

  }, {
    key: '_pauseLoop',
    value: function _pauseLoop() {
      clearInterval(this.autoplay);
      this.$el.trigger('carousel-pause');
    }
  }]);

  return Carousel;
}();

exports.default = Carousel;