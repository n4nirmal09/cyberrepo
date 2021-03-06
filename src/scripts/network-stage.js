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
            this.stage1Tl = null
            this.stage2Tl = null
            this.stage3TL = null
            this.scrollController = null
            this.navNext = this.container.querySelector('.network-stage__arrow--next')
            this.navPrev = this.container.querySelector('.network-stage__arrow--prev')
            this.activeSlide = 0
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
            this.tl = gsap.timeline({onComplete: () => {
                this.timelineNext()
                if(this.options.autoPlay) {
                        this.replayLoop()
                }
            }})
            this.stage1Tl = gsap.timeline({paused: true})
            this.stage2Tl = gsap.timeline({paused: true})
            this.stage3Tl = gsap.timeline({paused: true})

            this.tl.add(this.revealAnimation(), 'reveal')
            this.stage1Tl.add(this.stage3AnimationReveal().timeScale(1.4), 'stage-1')
            this.stage2Tl.add(this.stage2AnimationReveal().timeScale(1.4), 'stage-1')
            this.stage3Tl.add(this.stage1AnimationReveal().timeScale(1.4), 'stage-1')

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
        stageReveal(stage) {
            if(!stage) return
            let tl = gsap.timeline()
        
            
            switch (stage) {
                case 1:
                    
                    this.stage1Tl.play()
                    break
                case 2:
                    this.stage2Tl.play()
                    break
                case 3:
                    this.stage3Tl.play()
                    break
                default:
                    tl = null
                    break
            }
        }

        stageClose(stage) {
            if(!stage) return
            let tl = gsap.timeline()
            switch (stage) {
                case 1:
                    this.stage1Tl.reverse()
                    break
                case 2:
                    this.stage2Tl.reverse()
                    break
                case 3:
                    this.stage3Tl.reverse()
                    break
                default:
                    tl = null
                    break
            }
        }

        stage1AnimationReveal() {
            let tl = gsap.timeline()

            tl.add(this.createReveal2level(this.container.querySelector('#branch-a')), 'branch-start')
                .add(this.createReveal1level(this.container.querySelector('#branch-b')), 'branch-start+=0.4')
                .add(this.createReveal1level(this.container.querySelector('#branch-c')), 'branch-start+=0.8')

            return tl
        }

        stage2AnimationReveal() {
            let tl = gsap.timeline()

            tl.add(this.createReveal1level(this.container.querySelector('#branch-d')), 'branch-start')
                .add(this.createReveal1level(this.container.querySelector('#branch-e')), 'branch-start+=0.4')
                .add(this.createReveal1level(this.container.querySelector('#branch-f')), 'branch-start+=0.8')

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
            if (this.loopInterval) clearInterval(this.loopInterval)
        }
        replayLoop(direction) {
            if (!this.options.autoPlay) return

            this.clearLoop()

            this.loopInterval = setInterval(() => {
                this.timelineNext()
            }, this.options.autoPlayDelay)

        }

        // Direction
        timelineNext(clearLoop) {
            if(clearLoop) this.clearLoop()
            

            if (this.activeSlide < 3) {
                this.activeSlide += 1
                this.stageReveal(this.activeSlide)
                this.stageClose(this.activeSlide - 1)

            } else {
                
               this.activeSlide = 1
               this.stageReveal(1)
               this.stageClose(3)
            }
        }

        timelinePrev() {
            this.clearLoop()

            if (this.activeSlide > 1) {
                this.activeSlide -= 1
                this.stageReveal(this.activeSlide)
                this.stageClose(this.activeSlide + 1)
                
            } else {
                this.activeSlide = 3
                this.stageReveal(3)
                this.stageClose(1)
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
                this.timelineNext(true)
            })
            this.navPrev.addEventListener('click', () => {
                this.timelinePrev(true)
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
                        if (this.onFocus) this.timelinePrev(true)
                        break
                    case 39:
                        if (this.onFocus) this.timelineNext(true)
                }
            })

            // Parallax - not completed
            if (this.options.parallax) this.container.addEventListener("mousemove", this.parallaxOvers)

            // Room for mobile specific and other circle hover animation
            if ("ontouchstart" in document.documentElement) {

                if (this.options.touchSupport) {

                    swipe.registerSwipe(this.container.querySelector('.network-stage__canvas'), (rightSwipe) => {
                        if (rightSwipe) {
                            this.timelinePrev(true)
                        } else {
                            this.timelineNext(true)
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
        autoPlay: true,
        autoPlayDelay: 5000,
        repeat: false,
        stageTransitionDelay: 1,
        triggerHook: "onCenter",
        touchSupport: false,
        hoverCircle: false
    }

    if (document.querySelector('#network-stage')) new NetworkStage(document.querySelector('#network-stage'))


})(jQuery, window)