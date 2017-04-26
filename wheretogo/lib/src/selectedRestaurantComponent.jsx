import React from 'react';
import { Textfit } from 'react-textfit';
import {get} from 'axios';

const GOOGLE_API_KEY = "AIzaSyD2OW6VNqya1yPF07lbsWVHprOjlXrqhRc"

export default class SelectedRestaurantComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            restaurant: null,
        }
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
        const google_embed = `https://www.google.com/maps/embed/v1/place?q=${restaurant.name}&key=${GOOGLE_API_KEY}`

        if (restaurant.photos == null) {
            restaurant.photos = [];
        }
        return (
            <div key="selected" className="column-flex selected">
                <iframe
                    width="600"
                    height="450"
                    frameBorder="0"
                    style={{border: 0}}
                    src={google_embed}
                    allowFullScreen>
                </iframe>
                <Textfit mode="single" forceSingleModeWidth={false}>
                    {restaurant.name}
                </Textfit>
                {restaurant.photos.forEach(photo => {
                    return <img src={photo} />;
                })}
                <p>{restaurant.price} {restaurant.rating} {restaurant.review_count}</p>
                <button onClick={this.props.startAgain}>Start Again</button>
            </div>
        );
    }
}

SelectedRestaurantComponent.propTypes = {
    restaurant: React.PropTypes.object,
    startAgain: React.PropTypes.func,
};