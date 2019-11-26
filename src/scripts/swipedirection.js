"user strict"
export const swipe = {
    registerSwipe(container, callback) {
        
        let touchsurface = container,
            startX,
            startY,
            dist,
            threshold = 150, //required min distance traveled to be considered swipe
            allowedTime = 200, // maximum time allowed to travel that distance
            elapsedTime,
            startTime

        function handleswipe(isrightswipe) {
            
            callback(isrightswipe)
        }

        touchsurface.addEventListener('touchstart', function(e) {
            
            var touchobj = e.changedTouches[0]
            dist = 0
            startX = touchobj.pageX
            startY = touchobj.pageY
            startTime = new Date().getTime() // record time when finger first makes contact with surface
            e.preventDefault()
        }, false)

        // touchsurface.addEventListener('touchmove', function(e) {
        //     e.preventDefault() // prevent scrolling when inside DIV
        // }, false)

        touchsurface.addEventListener('touchend', function(e) {
            var touchobj = e.changedTouches[0]
            dist = touchobj.pageX - startX // get total dist traveled by finger while in contact with surface
            elapsedTime = new Date().getTime() - startTime // get time elapsed
            // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
            var swiperightBol = (elapsedTime <= allowedTime && dist >= threshold && Math.abs(touchobj.pageY - startY) <= 100) 
            handleswipe(swiperightBol)
            e.preventDefault()
        }, false)
    }
}