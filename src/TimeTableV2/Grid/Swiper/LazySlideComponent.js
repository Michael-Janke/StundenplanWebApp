import React from 'react';
import GridSlideComponent from './Grid.slide.component';

export default class LazySlideComponent extends React.Component {
    state = {
        rendered: null,
    };

    componentWillMount() {
        this.props.swiper.lazyComponents.push(this.lazyLoad);
        this.lazyLoad();
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
        const index = this.props.swiper.lazyComponents.indexOf(this.lazyLoad);
        this.props.swiper.lazyComponents.splice(index, 1);
    }

    lazyLoad = () => {
        let tempIndex = this.props.swiper.tempIndex;
        let index = this.props.index;
        const diff = Math.abs(tempIndex - index);
        clearTimeout(this.timeout);

        if (diff) {
            this.timeout = setTimeout(() => {
                if (!this.props.swiper.swiping) {
                    this.setState({ rendered: this.renderSlide() });
                } else {
                    this.lazyLoad();
                }
            }, diff * 300);
            
        } else {
            this.setState({ rendered: this.renderSlide() });
        }
        
    };

    renderSlide() {
        return <GridSlideComponent {...this.props}></GridSlideComponent>;
    }

    render() {
        return this.state.rendered;
    }
}
