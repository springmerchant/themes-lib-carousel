import $ from 'jquery';
import Carousel from '../../dist/js/carousel';

$(function(){
  new Carousel({
    el: $('.carousel'),
    delay: 4000
  });
})
