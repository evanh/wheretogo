import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import 'image-carousel.scss';

export default class ImageCarouselComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            index: 0,
        };

        this.changeIndex = this.changeIndex.bind(this);
    }

    componentDidMount() {
        const $img = $('#carousel-image');
        $img.on('load', function() {
            // Reset height and width so it can be scaled correctly
            if (this.naturalWidth < this.naturalHeight) {
                $img.width(300);
                $img.height(''); // These stay set from load to load, so need to unset them
            } else {

                $img.height(300);
                $img.width('');
            }
        });
    }

    changeIndex() {
        this.setState({
            index: this.state.index + 1,
        });
    }

    render() {
        return (
            <div>
                {this.props.images.map((i, idx) => {
                    return <div id="image-container" className="img_container">
                        <img
                            id={"carousel-image"+idx}
                            className="relative-centered"
                            src={i} />
                    </div>
                })}
            </div>
        );
    }
}

ImageCarouselComponent.propTypes = {
    rotateTime: React.PropTypes.number,
    images: React.PropTypes.array,
};