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
            class="pswp__button pswp__button--share"
            title="Links"
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

        <div
          class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"
        >
          <div class="pswp__share-tooltip"></div>
        </div>

        <button
          class="pswp__button pswp__button--arrow--left"
          title="Previous (Left)"
        ></button>

        <button
          class="pswp__button pswp__button--arrow--right"
          title="Next (Right)"
        ></button>

        <div class="pswp__caption">
          <div class="pswp__caption__center"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
@import '~photoswipe/dist/photoswipe.css'
@import '~photoswipe/dist/default-skin/default-skin.css'

.theme--light
  .pswp__bg
    background: #fff

  .pswp__top-bar,
  .pswp__caption
    background: none

  .pswp__counter,
  .pswp__preloader,
  .pswp__button
    filter: invert(1)

  .pswp--zoomed-in .pswp__caption
    opacity: 0

  .pswp__caption__center
    color: inherit

.favorite-icon
  font-size: 20px

@media screen and (min-width: 960px)
  .pswp__caption
    right: 0
    bottom: unset
    left: unset
    margin-top: 30vh
    width: calc(20vw - 32px)
    margin-right: 32px

    .pswp__ui--one-slide &
      width: 20vw
      margin-right: 0
</style>
