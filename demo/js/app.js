import $ from 'jquery';
import Carousel from '../../dist/js/carousel';

$(function(){
  const $el = $('.carousel');
  const $play = $('.button-play');
  const $pause = $('.button-pause');
  const $next = $('.button-next');
  const $prev = $('.button-prev');

  const carousel = new Carousel({
    el: $el,
    delay: 3000,
    pagination: true,
    autoplay: false,
  });

  // Event examples

  $el.on('carousel-change', (e, data) => {
    console.log('will change', data);
  });

  $el.on('carousel-changed', (e, data) => {
    console.log('did change', data);
  });

  $el.on('carousel-play', (e) => {
    console.log('playing');
  });

  $el.on('carousel-pause', (e) => {
    console.log('paused');
  });

  $el.on('carousel-resize', (e) => {
    console.log('will resize');
  });

  $el.on('carousel-resized', (e) => {
    console.log('did resize');
  });

  // Buttons

  $play.on('click', (e) => {
    e.preventDefault();
    carousel.play();
  });

  $pause.on('click', (e) => {
    e.preventDefault();
    carousel.pause();
  });

  $next.on('click', (e) => {
    e.preventDefault();
    carousel.nextSlide();
  });

  $prev.on('click', (e) => {
    e.preventDefault();
    carousel.previousSlide();
  });

  $el.on('carousel-play', (e) => {
    $play.addClass('disabled');
    $pause.removeClass('disabled');
  });

  $el.on('carousel-pause', (e) => {
    $play.removeClass('disabled');
    $pause.addClass('disabled');
  });
});
