import React from 'react';
import { Textfit } from 'react-textfit';
import {get} from 'axios';

const GOOGLE_API_KEY = 'AIzaSyD2OW6VNqya1yPF07lbsWVHprOjlXrqhRc';

export default class SelectedRestaurantComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            restaurant: null,
        };
    }

    componentWillReceiveProps(props) {
        get(`/restaurant/${props.restaurant.id}`).then(response => {
            if (response.status !== 200) {
                return;
            }

            this.setState({
                restaurant: response.data,
            });
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        const restaurant = this.state.restaurant || this.props.restaurant;
        const googleName = encodeURIComponent(restaurant.name);
        const googleEmbed = `https://www.google.com/maps/embed/v1/place?q=${googleName}&key=${GOOGLE_API_KEY}`;
        if (restaurant.photos == null) {
            restaurant.photos = [restaurant.image_url];
        }
        return (
            <div key="selected" className="column-flex selected">
                <div className="selected__container column-flex">
                    <iframe
                        width="478"
                        height="360"
                        frameBorder="0"
                        className="selected__google"
                        style={{border: 0}}
                        src={googleEmbed}
                        allowFullScreen>
                    </iframe>
                    <hr className="restaurant__divider" />
                    <Textfit
                        mode="single"
                        forceSingleModeWidth={false}
                        className="restaurant__name">
                        {restaurant.name}
                    </Textfit>
                    <hr className="restaurant__divider" />
                    <button
                        className="action-button selected__button"
                        onClick={this.props.startAgain}>
                        Start Again
                    </button>
                </div>
            </div>
        );
    }
}

SelectedRestaurantComponent.propTypes = {
    restaurant: React.PropTypes.object,
    startAgain: React.PropTypes.func,
};