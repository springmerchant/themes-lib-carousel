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

### options are self-explanatory

`el` and `delay`.

### some sample markup

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

  <div class="carousel-navigation">
    <span class="carousel-navigation-item carousel-previous">&larr;</span>
    <span class="carousel-navigation-item carousel-next">&rarr;</span>
  </div>
</section>
```

### further development

For debugging or improvements you can run a standalone test version of the carousel using a very basic node server:

```
$ npm install
$ jspm install
$ nodemon server.js
```
This will allow you to make changes to the JS and HTML. To re-compile the scss you'll need to run `node build.js` from a separate terminal window. After each change.
