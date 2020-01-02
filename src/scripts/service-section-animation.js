import { utilities } from './utilities'
import { settings } from './settings'

(function($, window) {
    "use strict"

    class ServiceAnim {
        constructor(container, options) {
            this.options = Object.assign({}, ServiceAnim.defaults, options)
            this.container = container
            this.serviceBoxes = container.querySelectorAll('.service-box')
            this.serviceBoxesLength = this.serviceBoxes.length
            this.tl = null
            this.scrollController = null
            this.progressPosition = 0
            this.progressTravelPosition = 0
            this.progressDuration = 0
            this.currentProgressPosition = 0

            this.init()
            //this.reInitOnResize()
        }

        init() {
            gsap.registerPlugin(DrawSVGPlugin)
            if(window.innerWidth >= 576) this.createMainRail()
            this.initServiceBoxes()
            if(window.innerWidth < 576) {
                this.mobileTimelineCreation()
            } else {
                this.mainTimelineCreation()
            }
            
            // Listeners
            this.scrollListener()
            
        }

        initServiceBoxes() {
            gsap.set(this.container.querySelectorAll('.service-circle__outer-path--a'), { drawSVG: "0% 0%", rotation: -180, transformOrigin: "50% 50%" })
            gsap.set(this.container.querySelectorAll('.service-circle__outer-path--b'), { drawSVG: "100% 100%", rotation: 180, transformOrigin: "50% 50%" })
            gsap.set(this.container.querySelectorAll('.service-box__title'), { autoAlpha: 0.2 })
            gsap.set(this.container.querySelectorAll('.service-circle__bullet--a, .service-circle__bullet--b'), { autoAlpha: 0, rotation: 0})
            gsap.set(this.container, { autoAlpha: 1 })
        }

        reset() {
            // gsap.killTweensOf([this.container.querySelectorAll('.service-circle__outer-path--a'), 
            //     this.container.querySelectorAll('.service-circle__outer-path--b'),
            //     this.container.querySelectorAll('.service-box__title'),
            //     this.container.querySelectorAll('.service-circle__bullet--a'),
            //     this.container.querySelectorAll('.service-circle__bullet--b'),
            //     this.container])
            if(this.container.querySelector('.progress-rail')) {
                this.container.removeChild(this.container.querySelector('.progress-rail'))
            }
            this.tl.kill()
            this.tl = null
            this.scrollController = null
            this.progressPosition = 0
            this.progressTravelPosition = 0
            this.progressDuration = 0
            this.currentProgressPosition = 0

        }

        createMainRail() {
            const circleSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
            circleSvg.setAttribute('viewBox', '0 0 20 20')
            circleSvg.setAttribute('class', 'progress-rail__bullet')
            const circleBullet = document.createElementNS("http://www.w3.org/2000/svg", "circle")
            circleBullet.setAttribute('cx', 10)
            circleBullet.setAttribute('cy', 10)
            circleBullet.setAttribute('r', 10)
            circleSvg.appendChild(circleBullet)

            const progressRail = document.createElement("div");
            progressRail.classList.add('progress-rail')

            progressRail.appendChild(circleSvg)

            this.container.appendChild(progressRail)

        }

        updateProgress(activeBox, full) {
        	
        	let serviceBoxRect = activeBox.getBoundingClientRect(),
        	containerRect = this.container.getBoundingClientRect()

        	this.currentProgressPosition = this.progressTravelPosition 
        	this.progressPosition = !full ? serviceBoxRect.left / containerRect.width * 100 : 100
        	this.progressTravelPosition = (serviceBoxRect.left + serviceBoxRect.width - 20) / containerRect.width * 100

        	this.progressDurationCalculation()

        }

        progressDurationCalculation() {
        	let duration = Math.abs((this.currentProgressPosition - this.progressPosition) / this.options.progressPixelDistance)
        	this.progressDuration = duration < 0.2 ? 0.2 : duration
        }

        mainTimelineCreation() {
            let inc = 0
            this.tl = gsap.timeline({
                delay: 0.5
            })
            this.tl.staggerFrom(this.serviceBoxes, 0.5, {y: 200, autoAlpha: 0}, 0.1, 'start')
            .to(this.container.querySelector('.progress-rail'), { duration: 0.2, autoAlpha: 1 }, 'start+=' + inc)

            this.serviceBoxes.forEach((serviceBox, i) => {
            		this.updateProgress(serviceBox)
                
                this.tl.add(this.boxTimeline(serviceBox, i), 'start+=' + inc)

                inc+=this.options.circleDrawDuration*.75
            })

            this.updateProgress(this.serviceBoxes[this.serviceBoxesLength - 1], 100)
            this.tl.to(this.container.querySelector('.progress-rail'), { 
            	duration: this.progressDuration, 
            	width: this.progressPosition + '%', 
            	ease: 'none',
                overwrite: 'all'
            }, 'start+=' + inc)


        }

        mobileTimelineCreation() {

            this.tl = gsap.timeline({
                delay: 0.5
            })

            this.tl.staggerFrom(this.serviceBoxes, 0.5, {y: 200, autoAlpha: 0}, 0.1, 'start')

            this.serviceBoxes.forEach((serviceBox, i) => {
                this.tl.to(serviceBox.querySelector('.service-circle__outer-path--a'), {
                    duration: 0.8,
                    drawSVG: "0% 100%",
                    rotation: 0
                }, 'active-mobile-' + i)
                .to(serviceBox.querySelector('.service-box__title'), {
                    duration: 0.5,
                    autoAlpha: 1
                }, 'active-mobile-' + i+'+=0.4')
            })
        }

        boxTimeline(serviceBox, i) {
            let tl = gsap.timeline(),
            inc = 1

            

            tl.to(this.container.querySelector('.progress-rail'), {
                    duration: this.progressDuration,
                    width: this.progressPosition + '%',
                    ease: 'none'
                })
                .add('drawCircle-' + i)
                .add(this.drawCircle(serviceBox))
                .add('drawBullet-' + i)
                .add(this.drawBullet(serviceBox), 'drawCircle-' + i)
                .to(serviceBox.querySelector('.service-box__title'), {
                	duration: this.options.circleDrawDuration - 0.1,
                	autoAlpha: 1
                }, 'drawCircle-' + i)
                .to(this.container.querySelector('.progress-rail'), {
                    duration: this.options.circleDrawDuration/2,
                    width: this.progressTravelPosition - 0.4 + '%',
                    ease: 'none'
                }, 'drawCircle-' + i)
                .add('box-tl-end-'+i)

            return tl

        }

        drawCircle(parentBox) {
            let tl = gsap.timeline({onComplete: () => this.drawCircle(parentBox)})
            gsap.set(this.container.querySelectorAll('.service-circle__outer-path--a'), { drawSVG: "0% 0%", rotation: -180, transformOrigin: "50% 50%" })
            tl.to(parentBox.querySelector('.service-circle__outer-path--a'), {
                    duration: this.options.circleDrawDuration,
                    drawSVG: '0% 100%',
                    ease: "none"
                }, 0)
                .to(parentBox.querySelector('.service-circle__outer-path--a'), {
                    duration: this.options.circleDrawDuration/2,
                    drawSVG: '100% 100%',
                    
                    ease: "none"
                }, this.options.circleDrawDuration/2)
                // .to(parentBox.querySelector('.service-circle__outer-path--b'), {
                //     duration: this.options.circleDrawDuration,
                //     drawSVG: '100% 0%',
                //     ease: "none"
                // }, 0)
                // .to(parentBox.querySelector('.service-circle__outer-path--b'), {
                //     duration: 0.5,
                //     drawSVG: '0% 0%',
                //     ease: "none"
                // }, 0.5)

            return tl
        }

        drawBullet(parentBox) {
        		let tl = gsap.timeline({onComplete: () => this.drawBullet(parentBox)}),
        		bulletA = parentBox.querySelector('.service-circle__bullet--a'),
        		bulletB = parentBox.querySelector('.service-circle__bullet--b')

        		tl.to([bulletA], {
        			duration: 0.1,
        			autoAlpha: 1,
        			ease: 'none'
        		}, 0)
        		.to(bulletA, {
        			duration: this.options.circleDrawDuration,
        			svgOrigin: '150px 150px',
        			rotation: "+=360",
                   // repeat: -1,
        			ease: 'none'
        		}, 0)
        		// .to(bulletB, {
        		// 	duration: this.options.circleDrawDuration,
        		// 	svgOrigin: '150px 150px',
        		// 	rotation: -360,
          //           repeat: -1,
        		// 	ease: 'none'
        		// }, 0)
        		// .to([bulletA, bulletB], {
        		// 	duration: 0.1,
        		// 	autoAlpha: 0,
        		// 	ease: 'none'
        		// }, this.options.circleDrawDuration - 0.1)

        		return tl
        }

        // Event listeners
        scrollListener() {
        	this.scrollController = new ScrollMagic.Controller()
        	let revealScene = new ScrollMagic.Scene({
        		triggerElement: this.container,
        		triggerHook: 'onEnter',
        		duration: 0
        	})
        	.setTween(this.tl)
        	.addTo(this.scrollController)

            revealScene.reverse(this.options.reverse)
        }

        // ReInit
        reInitOnResize() {
            let resize = utilities.debounce(()=> {
                this.reset()
                this.init()
            }, 250)

            window.addEventListener('resize', resize)
        }

    }

    ServiceAnim.defaults = {
    	circleDrawDuration: 1.6,
    	progressPixelDistance: 50,
        reverse: false
    }

    if(document.querySelector('#service-animation')) new ServiceAnim(document.querySelector('#service-animation'))

   

})(jQuery, window)