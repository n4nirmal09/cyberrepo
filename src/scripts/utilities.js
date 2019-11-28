"user strict"
export const utilities = {
    debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        }
    },

    isIE() {

        var ua = window.navigator.userAgent;

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;

    },

    // detect animation on scroll
    detectAnimation(elems) {
        let controller = new ScrollMagic.Controller()
        var elems = elems || $('.detect-animate')
        elems.each(function() {

            var elem = this
            var triggerElem = $(elem).data('trigger') ? $(elem).data('trigger') : elem
            var elementAnimation = $(elem).data('animation')
            var delay = $(elem).data('delay') ? $(elem).data('delay') : 0
            var speed = $(elem).data('speed') ? $(elem).data('speed') : 1
            var hook = $(elem).data('hook') ? $(elem).data('hook') : 'onEnter'
            var offset = $(elem).data('offset') || 200
            var tween = ''
            var duration = 0
            var reverse = ($(elem).data('reverse') === false) ? false : true
            var staggerOffset = 0.1
            var ease = $(elem).data('ease') ? $(elem).data('ease') : Power2.easeOut

            TweenLite.set(elem, { autoAlpha: 1 })

            if (window.innerWidth <= 1024) offset = 5

            switch (elementAnimation) {
                case "from-bottom":
                    tween = gsap.from(elem, {
                        duration: speed,
                        ease: ease,
                        delay: delay,
                        y: 50,
                        autoAlpha: 0
                    })
                    break
                case "from-bottom--stagger":
                    tween = gsap.from($(elem).find('>*'), {
                        duration: speed,
                        ease: ease,
                        delay: delay,
                        y: 50,
                        stagger: staggerOffset,
                        autoAlpha: 0
                    })
                    break
                default:
                    tween = ''
            };

            new ScrollMagic.Scene({ triggerElement: triggerElem, triggerHook: hook, offset: offset, duration: duration, reverse: false })
                .setTween(tween)
                .addTo(controller)


        })
    }
}
