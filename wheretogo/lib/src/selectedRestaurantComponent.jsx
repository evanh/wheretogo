import React from 'react';

export default class SelectedRestaurantComponent extends React.Component {
    render() {
        const restaurant = this.props.restaurant;
        return (
            <div>
                <span>{restaurant.name}</span>
                <img
                    src={restaurant.image_url}
                    className="restaurant__image" />
                <button onClick={this.props.startAgain}>Start Again</button>
            </div>
        );
    }
}

SelectedRestaurantComponent.propTypes = {
    restaurant: React.PropTypes.object,
    startAgain: React.PropTypes.func,
};