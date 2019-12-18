import { utilities } from './utilities'
import { settings } from './settings'
import { swipe } from './swipedirection'

(function($, window) {
    "use strict"

    class NetworkStage {
        constructor(container, options) {
            this.container = container
            this.options = Object.assign({}, NetworkStage.defaults, options)
            this.tl = null
            this.scrollController = null
            this.navNext = this.container.querySelector('.network-stage__arrow--next')
            this.navPrev = this.container.querySelector('.network-stage__arrow--prev')
            this.activeSlide = 1
            this.onFocus = false
            this.loopDirection = 'forward'
            this.loopInterval = null
            this.init()
        }

        init() {
            gsap.registerPlugin(DrawSVGPlugin)
            this.initializeCanvas()
            this.mainTimelineCreation()

            // Eventlisteners
            this.addEventListeners()

        }

        initializeCanvas() {
            gsap.set(this.container, { autoAlpha: 1 })
        }

        // Main Timeline creation
        mainTimelineCreation() {
            this.tl = gsap.timeline({
                onComplete: () => {
                    if (this.options.repeat) {
                        this.timelineSeekAndPlay('stage-1')
                    }
                }
            })

            this.tl.add(this.revealAnimation(), 'reveal')
                .add('stage-1', 1)
                .add(this.stage3AnimationReveal().timeScale(1.4), 'stage-1')
                .add(this.stage3AnimationClose().timeScale(1.4), 'stage-1-close')
                .add('stage-2', 'stage-1-close+=0.6')
                .add(this.stage2AnimationReveal().timeScale(1.4), 'stage-2')
                .add(this.stage2AnimationClose().timeScale(1.4), 'stage-2-close')
                .add('stage-3', 'stage-2-close+=0.6')
                .add(this.stage1AnimationReveal().timeScale(1.4), 'stage-3')
                .add(this.stage1AnimationClose().timeScale(1.4), 'stage-3-close')
                .add('end')

        }

        // Main reveal animation
        revealAnimation() {
            let tl = gsap.timeline(),
                dots = this.container.querySelectorAll('.network-stage__tree .st2'),
                lines = this.container.querySelectorAll('.network-stage__tree .st1'),
                label = this.container.querySelector('.network-stage__label')



            tl.from(dots, {
                    duration: 1,
                    scale: 0,
                    autoAlpha: 0,
                    ease: 'elastic.out(1, 0.4)',
                    stagger: 0.05,
                    transformOrigin: "50% 50%"
                })
                .from(lines, {
                    duration: 0.5,
                    drawSVG: gsap.utils.wrap(["50% 50%", "50% 50%"]),
                    ease: "none",
                    stagger: 0.05
                }, 0.6)
                .to(label, {
                    duration: 0.5,
                    autoAlpha: 1,
                    x: 0,
                    y: 0
                })

            return tl
        }

        // Animation stages
        stage1AnimationReveal() {
            let tl = gsap.timeline()

            tl.add(this.createReveal2level(this.container.querySelector('#branch-a')), 'branch-start')
                .add(this.createReveal1level(this.container.querySelector('#branch-b')), 'branch-start+=0.4')
                .add(this.createReveal1level(this.container.querySelector('#branch-c')), 'branch-start+=0.8')

            return tl
        }

        stage1AnimationClose() {
            let tl = gsap.timeline()

            tl.add(this.createClose2level(this.container.querySelector('#branch-a')), 'branch-start')
                .add(this.createClose1level(this.container.querySelector('#branch-b')), 'branch-start+=0.4')
                .add(this.createClose1level(this.container.querySelector('#branch-c')), 'branch-start+=0.8')

            return tl
        }

        stage2AnimationReveal() {
            let tl = gsap.timeline()

            tl.add(this.createReveal1level(this.container.querySelector('#branch-d')), 'branch-start')
                .add(this.createReveal1level(this.container.querySelector('#branch-e')), 'branch-start+=0.4')
                .add(this.createReveal1level(this.container.querySelector('#branch-f')), 'branch-start+=0.8')

            return tl
        }

        stage2AnimationClose() {
            let tl = gsap.timeline()

            tl.add(this.createClose1level(this.container.querySelector('#branch-d')), 'branch-start')
                .add(this.createClose1level(this.container.querySelector('#branch-e')), 'branch-start+=0.4')
                .add(this.createClose1level(this.container.querySelector('#branch-f')), 'branch-start+=0.8')

            return tl
        }

        stage3AnimationReveal() {
            let tl = gsap.timeline()

            tl.add(this.createReveal1level(this.container.querySelector('#branch-g')), 'branch-start')
                .add(this.createReveal1level(this.container.querySelector('#branch-h')), 'branch-start+=0.4')
                .add(this.createReveal1level(this.container.querySelector('#branch-i')), 'branch-start+=0.8')
                .add(this.createReveal1level(this.container.querySelector('#branch-j')), 'branch-start+=0.12')

            return tl
        }

        stage3AnimationClose() {
            let tl = gsap.timeline()

            tl.add(this.createClose1level(this.container.querySelector('#branch-g')), 'branch-start')
                .add(this.createClose1level(this.container.querySelector('#branch-h')), 'branch-start+=0.4')
                .add(this.createClose1level(this.container.querySelector('#branch-i')), 'branch-start+=0.8')
                .add(this.createClose1level(this.container.querySelector('#branch-j')), 'branch-start+=0.12')

            return tl
        }


        // Animation creation functions
        createReveal2level(branch) {
            gsap.set(branch, { autoAlpha: 1 })

            let tl = gsap.timeline(),
                bullet = branch.querySelector('.active-dot'),
                lineA = branch.querySelector('.active-line-a'),
                lineB = branch.querySelector('.active-line-b'),
                iconA = branch.querySelector('.active-icon-a'),
                iconB = branch.querySelector('.active-icon-b'),
                textA = branch.querySelector('.active-text-a'),
                textB = branch.querySelector('.active-text-b')

            tl.from(bullet, {
                    duration: 1,
                    scale: 0,
                    transformOrigin: "50% 50%",
                    ease: 'elastic.out(1, 0.4)',
                    transformOrigin: "50% 50%",
                    overwrite: 'all'
                }, 'bullet-active')
                .from(lineA, {
                    duration: 1,
                    drawSVG: "0% 0%",
                    ease: "power2.in",
                    overwrite: 'all'
                }, 'bullet-active')
                .from(iconA, {
                    duration: 0.6,
                    scale: 0,
                    transformOrigin: "50% 50%",
                    ease: "back.out(1.7)",
                    overwrite: 'all'
                }, 'iconAReveal')
                .from(textA, {
                    duration: 0.6,
                    autoAlpha: 0,
                    y: "+=20",
                    ease: "power2.out",
                    overwrite: 'all'
                }, 'iconAReveal')
                .from(lineB, {
                    duration: 1,
                    drawSVG: "0% 0%",
                    ease: "power2.in",
                    overwrite: 'all'
                }, 'iconAReveal')
                .from(iconB, {
                    duration: 0.6,
                    scale: 0,
                    transformOrigin: "50% 50%",
                    ease: "back.out(1.7)",
                    overwrite: 'all'
                }, 'iconBReveal')
                .from(textB, {
                    duration: 0.6,
                    autoAlpha: 0,
                    y: "+=20",
                    ease: "power2.out",
                    overwrite: 'all'
                }, 'iconBReveal')

            return tl
        }

        createClose2level(branch) {
            let tl = gsap.timeline(),
                bullet = branch.querySelector('.active-dot'),
                lineA = branch.querySelector('.active-line-a'),
                lineB = branch.querySelector('.active-line-b'),
                iconA = branch.querySelector('.active-icon-a'),
                iconB = branch.querySelector('.active-icon-b'),
                textA = branch.querySelector('.active-text-a'),
                textB = branch.querySelector('.active-text-b')

            tl.to(iconB, {
                    duration: 0.6,
                    scale: 0,
                    transformOrigin: "50% 50%",
                    ease: "back.in(1.7)",
                    overwrite: 'all'
                }, 'iconBClose')
                .to(textB, {
                    duration: 0.6,
                    autoAlpha: 0,
                    y: "+=20",
                    ease: "power2.in",
                    overwrite: 'all'
                }, 'iconBClose')
                .to(lineB, {
                    duration: 1,
                    drawSVG: "0% 0%",
                    ease: "power2.in",
                    overwrite: 'all'
                }, 'iconBClose')
                .to(iconA, {
                    duration: 0.6,
                    scale: 0,
                    transformOrigin: "50% 50%",
                    ease: "back.in(1.7)",
                    overwrite: 'all'
                }, 'iconAClose')
                .to(textA, {
                    duration: 0.6,
                    y: "+=20",
                    autoAlpha: 0,
                    ease: "power2.in",
                    overwrite: 'all'
                }, 'iconAClose')
                .to(lineA, {
                    duration: 1,
                    drawSVG: "0% 0%",
                    ease: "power2.in",
                    overwrite: 'all'
                }, 'iconAClose')
                .to(bullet, {
                    duration: 1,
                    scale: 0,
                    ease: 'elastic.in(1, 0.4)',
                    transformOrigin: "50% 50%",
                    overwrite: 'all'
                }, 'iconAClose+=0.5')

            return tl
        }

        createReveal1level(branch) {
            gsap.set(branch, { autoAlpha: 1 })

            let tl = gsap.timeline(),
                bullet = branch.querySelector('.active-dot'),
                lineA = branch.querySelector('.active-line-a'),
                iconA = branch.querySelector('.active-icon-a'),
                textA = branch.querySelector('.active-text-a'),
                relatedBullets = branch.querySelectorAll('.active-dot--related')

            tl.from(bullet, {
                    duration: 1,
                    scale: 0,
                    ease: 'elastic.out(1, 0.4)',
                    transformOrigin: "50% 50%",
                    overwrite: 'all'
                }, 'bullet-active')
                .from(lineA, {
                    duration: 1,
                    drawSVG: "0% 0%",
                    ease: "power2.in",
                    overwrite: 'all'
                }, 'bullet-active')
                .from(iconA, {
                    duration: 0.6,
                    scale: 0,
                    transformOrigin: "50% 50%",
                    ease: "back.out(1.7)",
                    overwrite: 'all'
                }, 'iconAReveal')

            if (textA) {
                tl.from(textA, {
                    duration: 0.6,
                    autoAlpha: 0,
                    y: '+=20',
                    ease: "power2.out",
                    overwrite: 'all'
                }, 'iconAReveal')
            }


            if (relatedBullets.length) {
                tl.from(relatedBullets, {
                    duration: 1,
                    ease: 'elastic.out(1, 0.4)',
                    scale: 0,
                    stagger: 0.2,
                    transformOrigin: "50% 50%",
                    overwrite: 'all'
                }, '0.5')
            }

            return tl
        }

        createClose1level(branch) {
            let tl = gsap.timeline(),
                bullet = branch.querySelector('.active-dot'),
                lineA = branch.querySelector('.active-line-a'),
                iconA = branch.querySelector('.active-icon-a'),
                textA = branch.querySelector('.active-text-a'),
                relatedBullets = branch.querySelectorAll('.active-dot--related')

            tl.to(iconA, {
                    duration: 0.6,
                    scale: 0,
                    transformOrigin: "50% 50%",
                    ease: "back.in(1.7)",
                    overwrite: 'all'
                }, 'iconAClose')
                .to(lineA, {
                    duration: 1,
                    drawSVG: "0% 0%",
                    ease: "power2.in",
                    overwrite: 'all'
                }, 'iconAClose')
                .to(bullet, {
                    duration: 1,
                    scale: 0,
                    ease: 'elastic.in(1, 0.4)',
                    transformOrigin: "50% 50%",
                    overwrite: 'all'
                }, 'iconAClose+=0.5')

            if (textA) {
                tl.to(textA, {
                    duration: 0.6,
                    autoAlpha: 0,
                    y: "+=20",
                    overwrite: 'all',
                    ease: "power2.in"
                }, 'iconAClose')
            }
            if (relatedBullets.length) {
                tl.to(relatedBullets, {
                    duration: 1,
                    ease: 'elastic.in(1, 0.4)',
                    scale: 0,
                    stagger: -0.2,
                    transformOrigin: "50% 50%",
                    overwrite: 'all'
                }, 'iconAClose+=0.6')
            }

            return tl
        }

        //TimelineControls
        timelineTweenToAndPause(label) {
            this.tl.tweenTo(label)
            this.tl.pause()
        }

        timelineSeekAndPlay(label) {
            this.tl.seek(label)
            this.tl.play()
        }

        // On tween update function
        updateActiveSlide(slide) {
            this.activeSlide = slide
            console.log(this.activeSlide)
        }

        // LoopRest
        clearLoop() {
            if (this.loopInterval) clearTimeout(this.loopInterval)
        }
        resetLoop(direction) {
            if (!this.options.autoPlay) return

            this.loopInterval = setTimeout(() => {
                if(direction === 'forward') {
                    this.loopDirection = 'forward'
                    this.timelineNext()
                } else {
                    this.loopDirection = 'backward'
                    this.timelinePrev()
                }
                
            }, this.options.autoPlayDelay)

        }

        // Direction
        timelineNext() {
            this.clearLoop()
            if (this.activeSlide < 3) {
                this.resetLoop('forward')
                this.activeSlide += 1
                this.tl.timeScale(1).tweenTo('stage-' + this.activeSlide + '-close')
            } else {
                this.activeSlide = 1
                this.tl.timeScale(3).tweenTo('stage-' + this.activeSlide + '-close')
            }
        }

        timelinePrev() {
            this.clearLoop()
            if (this.activeSlide > 1) {
                this.resetLoop('backward')
                this.activeSlide -= 1
                this.tl.timeScale(1).tweenTo('stage-' + this.activeSlide + '-close')
            } else {
                this.activeSlide = 3
                this.tl.timeScale(3).tweenTo('stage-' + this.activeSlide + '-close')
            }
        }

        // ScrollControllers and scenes
        scrollControlListeners() {

            this.scrollController = new ScrollMagic.Controller()

            let scene = new ScrollMagic.Scene({
                    triggerElement: this.container,
                    duration: 0,
                    triggerHook: this.options.triggerHook,
                    offset: -100
                })
                .setTween(this.tl)
                .on('enter', () => {
                    if (this.activeSlide === 1) {
                        this.tl.tweenTo('stage-1-close')
                        this.resetLoop('forward')
                    }
                })
                .addTo(this.scrollController)

            let viewFocus = new ScrollMagic.Scene({
                    triggerElement: this.container,
                    duration: this.container.getBoundingClientRect().height,
                    triggerHook: this.options.triggerHook,
                    offset: -100
                })
                .on('enter', () => {
                    this.onFocus = true
                })
                .on('leave', () => {
                    this.onFocus = false
                })
                .addTo(this.scrollController)
        }

        // For parallax
        parallaxOvers(e) {
            let pageWt = window.innerWidth,
                pageHt = window.innerHeight,
                parallaxSVG = this.querySelector('.network-stage__svg'),
                pageX = e.pageX - pageWt,
                pageY = e.pageY - pageHt,
                fixer = -0.002
            if (parallaxSVG) {
                gsap.to(parallaxSVG, {
                    duration: 1,
                    rotationY: (parallaxSVG.clientLeft + pageX) * fixer,
                    rotationX: (parallaxSVG.clientTop + pageY) * fixer,
                    ease: "power2.out",
                    //overwrite: "all"
                })
            }

            // parallaxElems.forEach(function(elem, index) {
            //     fixer = fixer - 0.008
            //     gsap.to(elem, {
            //         duration: 1,
            //         x: (elem.clientLeft + pageX) * fixer,
            //         y: (elem.clientTop + pageY) * fixer,
            //         ease: "power2.out",
            //         //overwrite: "all"
            //     })
            // })
        }

        // Event listeners
        addEventListeners() {

            // Navitems
            this.navNext.addEventListener('click', () => {
                this.timelineNext()
            })
            this.navPrev.addEventListener('click', () => {
                this.timelinePrev()
            })

            // Scroll listeners invocation and for resize
            this.scrollControlListeners()
            const resize = utilities.debounce(() => {
                this.scrollControlListeners()
            }, 250)
            window.addEventListener('resize', resize)


            // Arrow key listeners
            document.addEventListener('keydown', (e) => {
                switch (e.keyCode) {
                    case 37:
                        if (this.onFocus) this.timelinePrev()
                        break
                    case 39:
                        if (this.onFocus) this.timelineNext()
                }
            })

            // Parallax - not completed
            if (this.options.parallax) this.container.addEventListener("mousemove", this.parallaxOvers)

            // Room for mobile specific and other circle hover animation
            if ("ontouchstart" in document.documentElement) {

                if (this.options.touchSupport) {

                    swipe.registerSwipe(this.container.querySelector('.network-stage__canvas'), (rightSwipe) => {
                        if (rightSwipe) {
                            this.timelinePrev()
                        } else {
                            this.timelineNext()
                        }
                    })
                }

            } else {
                if (this.options.hoverCircle) {
                    let circles = this.container.querySelectorAll('.active-icon-a, .active-icon-b')
                    circles.forEach((circle, i) => {
                        circle.addEventListener("mouseenter", function() {
                            gsap.to(this.querySelector('.st3'), {
                                duration: 0.3,
                                scale: 1.2,
                                ease: "power2.out",
                                overwrie: "all",
                                transformOrigin: "50% 50%"
                            })
                        }, false)
                        circle.addEventListener("mouseleave", function() {
                            gsap.to(this.querySelector('.st3'), {
                                duration: 0.3,
                                scale: 1,
                                ease: "power2.out",
                                transformOrigin: "50% 50%",
                                overwrie: "all"
                            })
                        }, false)
                    })
                }

            }

        }

    }



    NetworkStage.defaults = {
        parallax: false,
        autoPlay: false,
        autoPlayDelay: 8000,
        repeat: false,
        stageTransitionDelay: 1,
        triggerHook: "onCenter",
        touchSupport: false,
        hoverCircle: false
    }

    if (document.querySelector('#network-stage')) new NetworkStage(document.querySelector('#network-stage'))


})(jQuery, window)