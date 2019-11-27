import { utilities } from './utilities'
import { settings } from './settings'

(function($) {
    'use strict'
    
    class WorkSteps {
        constructor(container, options) {
            this.options = Object.assign({}, WorkSteps.defaults, this.options)
            this.container = container
            this.slider = this.container.querySelector('.steps-slider__list')
            this.slides = this.container.querySelectorAll('.steps-slide')
            this.sliderLength = this.slides.length
            this.nextBtn = this.container.querySelector('.steps-slider__nav-arrow--next')
            this.prevBtn = this.container.querySelector('.steps-slider__nav-arrow--prev')

            this.init()
        }

        init() {
            this.createPagination()
            this.createSlider()
            this.addingListeners()
            

        }

        createPagination() {
            const pageDiv = document.createElement("nav")

            pageDiv.classList.add('steps-slider__pagination')

            

            this.slides.forEach( (slide, i) => {
                const navItem = document.createElement("div")
                navItem.classList.add('steps-slider__pagination-item')
                const numberSpan = document.createElement("span")
                numberSpan.classList.add('steps-slider__pagination-item-number')
                numberSpan.innerHTML = i+1
                const textSpan = document.createElement("span")
                textSpan.classList.add('steps-slider__pagination-item-text')
                textSpan.innerHTML = slide.dataset.title

                navItem.append(numberSpan)
                navItem.append(textSpan)

                navItem.addEventListener('click', (e) => {
                    e.preventDefault()
                    console.log('poda')
                    this.sliderGoto(e, i)
                })

                pageDiv.append(navItem)
            })

            this.container.prepend(pageDiv)
        }

        createSlider() {
            $(this.slider).slick({
                dots: false,
                infinite: false,
                speed: 300,
                slidesToShow: 1,
                adaptiveHeight: true,
                arrows: false,
                swipe: true,
                touchMove: true
            })
            $(this.slider).slick('slickGoTo', this.options.defaultNav)
            this.activeNavCheck(this.options.defaultNav)
            $(this.slider).on('beforeChange', (event, slick, currentSlide, nextSlide) => {
                this.activeNavCheck(nextSlide)
            })
        }

        activeNavCheck(activeI) {
           
            $(this.container).find('.steps-slider__pagination-item').removeClass('steps-slider__pagination-item--active')
            $(this.container).find('.steps-slider__pagination-item').eq(activeI).addClass('steps-slider__pagination-item--active')
        }
        // Slider controls
        sliderGoto(e, index) {
            e.preventDefault()
            $(this.slider).slick('slickGoTo', index);

        }

        slideNext(e) {
            e.preventDefault()
            $(this.slider).slick('slickNext')
        }

        slidePrev(e) {
            e.preventDefault()
            $(this.slider).slick('slickPrev')
        }

        // Adding listners
        addingListeners() {
            
            this.nextBtn.addEventListener('click', (e) => {

                this.slideNext(e)
            })

            this.prevBtn.addEventListener('click', (e) => {
                this.slidePrev(e)
            })
        }
    }

    WorkSteps.defaults = {
        defaultNav: 0,
        ripple: true
    }

    new WorkSteps(document.querySelector('#steps-slider'))
    
})(jQuery)