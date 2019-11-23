"user strict"
export const settings = {
    breakpoints: {
        name: 'CyberMdx',
        desktop: 1280,
        tablet: 1025,
        mobile: 576
    },
    scrollBarWidth: 0,

    scrollBarWidthUpdate() {
        var outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

        document.body.appendChild(outer);

        var widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = "scroll";

        // add innerdiv
        var inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);

        var widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);

        this.scrollBarWidth = widthNoScroll - widthWithScroll;


    }
}

settings.scrollBarWidthUpdate()