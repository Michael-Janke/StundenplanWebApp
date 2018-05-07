import Sticky from 'react-sticky-el';

export default class EnhancedSticky extends Sticky {
    scrollToMe() {
        const holderRect = this.holderEl.getBoundingClientRect();
        const toValue = this.scrollElement.scrollTop + holderRect.top - 92;
        const duration = 1000;

        var startingY = this.scrollElement.scrollTop;
        var diff = toValue - startingY;
        var start;
        if (diff === 0) {
            return;
        }
        this.holderEl.classList.add('sticky');
        var step = (timestamp) => {
            if (!start) start = timestamp;
            var time = timestamp - start;
            var percent = Math.min(time / duration, 1);
            this.scrollElement.scrollTop = startingY + diff * percent;
            if (time <= duration) {
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
    }
}