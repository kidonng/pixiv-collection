<template>
  <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="pswp__bg"></div>

    <div class="pswp__scroll-wrap">
      <div class="pswp__container">
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
      </div>

      <div class="pswp__ui pswp__ui--hidden">
        <div class="pswp__top-bar">
          <div class="pswp__counter"></div>

          <button
            class="pswp__button pswp__button--close"
            title="Close (Esc)"
          ></button>

          <button
            class="pswp__button pswp__button--fs"
            title="Fullscreen"
          ></button>

          <button
            class="pswp__button pswp__button--zoom"
            title="Zoom in/out"
          ></button>

          <div class="pswp__preloader">
            <div class="pswp__preloader__icn">
              <div class="pswp__preloader__cut">
                <div class="pswp__preloader__donut"></div>
              </div>
            </div>
          </div>
        </div>

        <button
          class="pswp__button pswp__button--arrow--left"
          title="Previous (Arrow Left)"
        ></button>

        <button
          class="pswp__button pswp__button--arrow--right"
          title="Next (Arrow Right)"
        ></button>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
@import '../../../node_modules/photoswipe/dist/photoswipe.css'
@import '../../../node_modules/photoswipe/dist/default-skin/default-skin.css'

.pswp__top-bar
  background: none

.theme--light
  .pswp__bg
    background: white

  .pswp__counter,
  .pswp__preloader,
  .pswp__button
    filter: invert(1)
</style>
