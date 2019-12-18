import { utilities } from './utilities'
import { settings } from './settings'

(function($, window) {
    'use strict'

    class InteractiveTable {
        constructor(container, options) {
            this.options = Object.assign({}, InteractiveTable.defaults, options)
            this.container = container
            this.expanderRows = this.container.querySelectorAll('.interactive-table-expander')
            this.noOfExpander = this.expanderRows.length
            this.triggerClass = 'interactive-table-expander__header'
            this.activeExpander = this.container.querySelectorAll('.interactive-table-expander--open')
            

            this.init()
        }

        init() {
            if (this.activeExpander.length) {
                this.open(this.activeExpander[0])
            }
            this.addingEventListeners()
        }

        expandToggle(expander) {
            if (!expander.classList.contains('interactive-table-expander--open')) {
                this.closeAllExpander()
                this.open(expander)
            } else {
                this.close(expander)
            }
        }

        open(expander) {
            $(expander).addClass('interactive-table-expander--open')
            $(expander).find('.interactive-table-expander__content').slideDown()

            gsap.to($(expander).find('.ver-path'), { duration: 0.5, scaleY: 0, transformOrigin: "50% 50%" })
        }

        close(expander) {
            $(expander).removeClass('interactive-table-expander--open')
            $(expander).find('.interactive-table-expander__content').slideUp()

            gsap.to($(expander).find('.ver-path'), { duration: 0.5, scaleY: 1, transformOrigin: "50% 50%" })
        }

        closeAllExpander() {
            this.expanderRows.forEach((expander, i) => {
                this.close(expander)
            })
        }

        // Optional ripple
        createRipple(e) {
            // if (this.getElementsByClassName('ripple').length > 0) {
            //     this.removeChild(this.querySelector('.ripple'))
            // }
            let colors = ['#fff', '#2be9af'],
            bg = colors[0]
            if(this.closest('.interactive-table-expander').classList.contains('interactive-table-expander--open')) {
            	bg = colors[1]
            }
            var circle = document.createElement('div')
            this.appendChild(circle)

            var d = Math.max(this.clientWidth, this.clientHeight)
            circle.style.width = circle.style.height = d + 'px'
            var elem = this.getBoundingClientRect()

            circle.style.left = e.pageX - this.offsetLeft - d / 2 + 'px';
  					circle.style.top = e.pageY - this.offsetTop - d / 2 + 'px';

            circle.style.backgroundColor = bg

            circle.classList.add('ripple')

            gsap.to(circle, {
            	duration: 1,
            	scale: 1.5,
            	autoAlpha: 0,
            	onComplete() {
            		circle.parentNode.removeChild(circle)
            	}
            })
        }

        addingEventListeners() {
            this.expanderRows.forEach((row, i) => {
                let triggerElem = row.querySelector('.' + this.triggerClass)
                triggerElem.addEventListener('click', (e) => {
                    e.preventDefault()
                    this.expandToggle(row)
                })
            })

            if(this.options.ripple) {
            	let triggerElem = document.querySelectorAll('.' + this.triggerClass)
            	triggerElem.forEach((elem, i) => {
            		elem.addEventListener("click", this.createRipple)
            	})
            }
        }
    }

    InteractiveTable.defaults = {
        ripple: true
    }

    if(document.querySelector('#interactive-table')) new InteractiveTable(document.querySelector('#interactive-table'))



})(jQuery, window)