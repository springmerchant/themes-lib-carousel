# Bigcommerce Carousel Module

Make the big images change.

### Installation

```
jspm install --save bc-carousel=bitbucket:pixelunion/bc-carousel
```

### Usage

```
import $ from 'jquery';
import Carousel from 'bc-carousel';

new Carousel({
  el: $('.carousel');
  delay: 4000
});
```

### Options are self-explanatory

`el`: the jQuery object of our carousel container.
`delay`: transition delay, in milliseconds.
`pagination`: whether or not to include pagination dots (defaults to `false`).
`autoplay`: whether or not to start playing right away (defaults to `true`).
`dotText`: wheher or not to set an explicit text, or to use integers (defaults to `false`).

### Methods

`play`: start slideshow looping.
`pause`: stop slideshow loopting.
`nextSlide`: show the next slide.
`previousSlide`: show the previous slide.
`changeSlide`: (`targetIndex, animationDirection = 'auto'`) show the slide at `targetIndex`, optionally specifying the animation class.

### Events

You can listen to events on the `el` container.

`carousel-resize`: the carousel is about to be resized.
`carousel-resized`: the carousel has just been resized, typically after a window resize.
`carousel-change`: the carousel is about to change slides. `from` and `to` indexes are passed into the event context.
`carousel-changed`: the carousel has just changed slides. `from` and `to` indexes are passed into the event context.
`carousel-play`: the carousel has started looping.
`carousel-pause`: the carousel has stopped looping.

```
const $carousel = $('.carousel');

const carousel = new Carousel({
  el: $carousel,
});

$carousel.on('carousel-change', (e, context) => {
  console.log(`carousel is changing from ${context.from} to ${context.to}`);
});
```

### Some sample markup

```
<section class="carousel">
  {{#each carousel}}
    <figure class="carousel-item {{#if @first}}active{{/if}}">
      <a class="carousel-item-image" href="{{{url}}}">
        <img src="{{image}}" alt="{{{alt_text}}}" />
      </a>
      <figcaption class="carousel-item-info">
        <h2>{{heading}}</h2>
        <p>{{text}}</p>
        <a class="button" href="{{{url}}}">{{button_text}}</a>
      </figcaption>
    </figure>
  {{/each}}

  <div class="carousel-pagination">
    {{#for 0 ../slide_count}}
      {{#if $index '!==' ../../slide_count}}
        <span class="{{#if $index '===' 0}}active{{/if}}" data-carousel-pagination-item data-slide="{{$index}}">{{$index}}</span>
      {{/if}}
    {{/for}}
  </div>

  <div class="carousel-navigation">
    <span class="carousel-navigation-item carousel-previous">&larr;</span>
    <span class="carousel-navigation-item carousel-next">&rarr;</span>
  </div>
</section>
```

### Further Development

For debugging or improvements you can run a standalone test version of the carousel using a very basic node server:

```
$ npm install
$ jspm install
$ npm run serve
```
This will allow you to make changes to the JS and HTML. To re-compile the scss you'll need to run `npm run build` from a separate terminal window after each change.
