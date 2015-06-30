import $ from 'jquery';
import Carousel from '../../dist/js/carousel';

$(function(){
  const $el = $('.carousel');

  new Carousel({
    el: $el,
    delay: 6000,
    pagination: true,
  });

  $el.on('carousel-change', (e, data) => {
    console.log('will change', data);
  });

  $el.on('carousel-changed', (e, data) => {
    console.log('did change', data);
  });
})
