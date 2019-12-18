import { utilities } from './utilities'
import { settings } from './settings'

(function($, window) {
    const banners = {

        lazyLoading() {

            let preloadBgs = $('.bg-img--preload'),
                controller = new ScrollMagic.Controller(),
                bannerAnimationPlayed = false

            function processFigure(figure) {

                var src = $(figure).data('desktop-src'),
                    mobSrc = $(figure).data('mobile-src'),
                    screenSrcsData = $(figure).data('image-array'),
                    screenSrcs = screenSrcsData.slice().reverse(),
                    loadingSrc = ""


                for (let i = 0; i < screenSrcs.length; i++) {
                    if (window.innerWidth > screenSrcs[i].screen) {
                        loadingSrc = screenSrcs[i].src
                        break
                    }
                }

                if (loadingSrc) {
                    var img = $("<img />").attr('src', loadingSrc)
                    if (img.complete) {
                        giveImage(loadingSrc, figure);
                    } else {
                        img.on('load', () => {
                                giveImage(loadingSrc, figure);
                                if (!bannerAnimationPlayed) banners.bannerAnimation() // For animation set
                                bannerAnimationPlayed = true
                            })
                            .on('error', function() {
                                // giveImage('assets/images/no-preview-available.png');
                            })
                    }
                }
            }

            function giveImage(src, figure) {
                $(figure).css('background-image', 'url(' + src + ')');
                $(figure).removeClass('bg-img--preload')
                $(figure).addClass('bg-img--loaded');
            }

            for (var i = 0; i < preloadBgs.length; i++) {

                let scene = new ScrollMagic.Scene({ triggerElement: preloadBgs[i], triggerHook: 'onEnter' })
                    .on('enter', function() {
                        let triggerElem = this.triggerElement(),
                            resizeFunc = utilities.debounce(() => {
                                processFigure(triggerElem)
                            }, 250)
                        processFigure(triggerElem);
                        window.addEventListener('resize', resizeFunc)
                    })
                    .addTo(controller);

            }

        },

        bannerAnimation() {
            if(!document.querySelector('.hero-banner__container')) return
            let heroBannerContainer = document.querySelector('.hero-banner__container'),
                outerPath = document.querySelector('.hero-banner__circle-outerpath'),
                innerPath = document.querySelector('.hero-banner__circle-innerpath'),
                bullet = document.querySelector('.hero-banner__circle-bullet'),
                words = document.querySelectorAll('.hero-banner__title-word'),
                tl = null

            setAnimation()

            function setAnimation() {
                gsap.registerPlugin(DrawSVGPlugin)
                gsap.registerPlugin(MotionPathPlugin)

                gsap.to(heroBannerContainer, {
                    duration: 1,
                    autoAlpha: 1
                })
            }

            tl = gsap.timeline({
                delay: 1
            })

            tl.fromTo(outerPath, {
                    drawSVG: "0% 0%",
                }, {
                    duration: 1,
                    drawSVG: "0% 50%",
                    ease: "power2.out",
                    overwrite: 'all'
                })
            if(utilities.isIE() > 11 || !utilities.isIE()) {
                gsap.set(bullet, {
                    xPercent: -50,
                    yPercent: -50,
                    transformOrigin: "50% 50%"
                })
                tl.to(bullet, {
                    duration: 1,
                    motionPath: {
                        path: innerPath,
                        align: innerPath,
                        start: 0,
                        end: 0.48
                    },
                    overwrite: 'all',
                    ease: "power2.out"
                }, 0)
            } else { // For Less than IE11 because motion path align issue for circle
                gsap.set(bullet, {autoAlpha: 0, x: 50.2244, y: 390.0392})
                tl.to(bullet,{duration: 0.5, autoAlpha: 1}, 0.5)
            }
                
                tl.from(words, {
                    duration: 0.5,
                    stagger: 0.05,
                    yPercent: 100
                }, 0.8)



        },

        parallax() {
            if(!document.querySelector('.hero-banner')) return
            let heroBanner = document.querySelector('.hero-banner'),
                background = heroBanner.querySelector('.background'),
                content = heroBanner.querySelector('.hero-banner__row'),
                duration = "400%",
                hook = "onLeave",
                triggerElement = heroBanner,
                outerPath = document.querySelector('.hero-banner__circle-outerpath'),
                innerPath = document.querySelector('.hero-banner__circle-innerpath'),
                bullet = document.querySelector('.hero-banner__circle-bullet'),
                words = document.querySelectorAll('.hero-banner__title-word'),
                scrollController = new ScrollMagic.Controller(),
                tl = gsap.timeline()



            tl.to([background, content], {
                    duration: 0.5,
                    y: "100%",
                    rotation: 0.002
                })
                // .to(outerPath, {
                //     duration: 1,
                //     drawSVG: "50% 100%",
                //     ease: "power2.out",
                // }, 0)
                // .to(bullet, {
                //     duration: 1,
                //     motionPath: {
                //         path: innerPath,
                //         align: innerPath,
                //         start: 0.48,
                //         end: 1
                //     },
                //     ease: "power2.out"
                // }, 0)
            let scene = new ScrollMagic.Scene({
                    triggerElement: triggerElement,
                    triggerHook: hook,
                    reverse: true,
                    duration: duration
                })
                .setTween(tl)
                .addTo(scrollController);
        }
    }



    banners.lazyLoading()
    if(!utilities.isIE()) {
        banners.parallax()
    }

    // for banner reveals - all elements
    utilities.detectAnimation()
    

})(jQuery, window)