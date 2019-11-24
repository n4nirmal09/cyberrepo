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
        }

        init() {
            gsap.registerPlugin(DrawSVGPlugin)
            this.createMainRail()
            this.initServiceBoxes()
            this.mainTimelineCreation()
            this.scrollListener()
        }

        initServiceBoxes() {
            gsap.set(this.container.querySelectorAll('.service-circle__outer-path--a'), { drawSVG: "0% 0%", rotation: -180, transformOrigin: "50% 50%" })
            gsap.set(this.container.querySelectorAll('.service-circle__outer-path--b'), { drawSVG: "100% 100%", rotation: 180, transformOrigin: "50% 50%" })
            gsap.set(this.container.querySelectorAll('.service-box__title'), { autoAlpha: 0.2 })
            gsap.set(this.container.querySelectorAll('.service-circle__bullet--a, .service-circle__bullet--b'), { autoAlpha: 0 })
            gsap.set(this.container, { autoAlpha: 1 })
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
            this.tl = gsap.timeline({
                delay: 0.5
            })
            this.tl.staggerFrom(this.serviceBoxes, 0.5, {y: 200, autoAlpha: 0}, 0.1, 'start')
            .to(this.container.querySelector('.progress-rail'), { duration: 0.2, autoAlpha: 1 })

            this.serviceBoxes.forEach((serviceBox, i) => {
            		this.updateProgress(serviceBox)
                this.tl.add(this.boxTimeline(serviceBox, i), 'active-tl-' + i)
            })

            this.updateProgress(this.serviceBoxes[this.serviceBoxesLength - 1], 100)
            this.tl.to(this.container.querySelector('.progress-rail'), { 
            	duration: this.progressDuration, 
            	width: this.progressPosition + '%', 
            	ease: 'none'
            }, 'end')


        }

        boxTimeline(serviceBox, i) {
            let tl = gsap.timeline()

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
                    duration: this.options.circleDrawDuration,
                    width: this.progressTravelPosition + '%',
                    ease: 'none'
                }, 'drawCircle-' + i)

            return tl

        }

        drawCircle(parentBox) {
            let tl = gsap.timeline()

            tl.to(parentBox.querySelector('.service-circle__outer-path--a'), {
                    duration: this.options.circleDrawDuration,
                    drawSVG: '0% 51%',
                    ease: "none"
                }, 0)
                .to(parentBox.querySelector('.service-circle__outer-path--b'), {
                    duration: this.options.circleDrawDuration,
                    drawSVG: '100% 49%',
                    ease: "none"
                }, 0)

            return tl
        }

        drawBullet(parentBox) {
        		let tl = gsap.timeline(),
        		bulletA = parentBox.querySelector('.service-circle__bullet--a'),
        		bulletB = parentBox.querySelector('.service-circle__bullet--b')

        		tl.to([bulletA, bulletB], {
        			duration: 0.1,
        			autoAlpha: 1,
        			ease: 'none'
        		}, 0)
        		.to(bulletA, {
        			duration: this.options.circleDrawDuration,
        			svgOrigin: parentBox.getBoundingClientRect().width/2 + ' ' + parentBox.getBoundingClientRect().width/2,
        			rotation: 180,
        			ease: 'none'
        		}, 0)
        		.to(bulletB, {
        			duration: this.options.circleDrawDuration,
        			svgOrigin: parentBox.getBoundingClientRect().width/2 + ' ' + parentBox.getBoundingClientRect().width/2,
        			rotation: -180,
        			ease: 'none'
        		}, 0)
        		.to([bulletA, bulletB], {
        			duration: 0.1,
        			autoAlpha: 0,
        			ease: 'none'
        		}, this.options.circleDrawDuration - 0.1)

        		return tl
        }

        scrollListener() {
        	this.scrollController = new ScrollMagic.Controller()
        	let revealScene = new ScrollMagic.Scene({
        		triggerElement: this.container,
        		triggerHook: 'onEnter',
        		duration: 0
        	})
        	.setTween(this.tl)
        	.addTo(this.scrollController)
        }

    }

    ServiceAnim.defaults = {
    	circleDrawDuration: 0.7,
    	progressPixelDistance: 50
    }

    new ServiceAnim(document.querySelector('#service-animation'))

})(jQuery, window)