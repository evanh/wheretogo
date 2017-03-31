import React from 'react';

export default class RestaurantComponent extends React.Component {
    constructor(props){
        super(props);

        props.restaurants.forEach(r => {
            r.walkingMinutes = (60.0 / 5000.0) * r.distance;
        });

        this.state = {
            topCategory: null,
            currentRestaurant: props.restaurants[0],
            restaurants: [...props.restaurants],
        };

        this.restaurantSelected = this.restaurantSelected.bind(this);
        this.restaurantRejected = this.restaurantRejected.bind(this);
        this.categoryRejected = this.categoryRejected.bind(this);
        this.distanceRejected = this.distanceRejected.bind(this);
    }

    restaurantSelected() {
        // maybe an animation or something
        this.props.restaurantSelected(this.state.currentRestaurant);
    }

    restaurantRejected(restaurant) {
        this.restaurantFilter(r => {
            return r.id !== restaurant.id;
        });
    }

    categoryRejected(category) {
        this.restaurantFilter(r => {
            for (let i = 0; i < r.categories.length; i++) {
                if (category.alias === r.categories[i].alias) {
                    return false;
                }
            }
            return true;
        });
        this.props.categoryRejected(category);
    }

    distanceRejected(restaurant) {
        this.restaurantFilter(r => restaurant.distance > r.distance);
        this.props.distanceRejected(restaurant.distance);
    }

    restaurantFilter(filterFn) {
        const filtered = this.state.restaurants.filter(filterFn);
        if (filtered.length === 0) {
            this.props.noValidRestaurants();
            return;
        }

        this.setState({
            restaurants: filtered,
            currentRestaurant: filtered[0],
        });
    }

    render() {
        return (
            <div className="restaurant">
                <span>{this.state.currentRestaurant.name}</span>
                <img
                    src={this.state.currentRestaurant.image_url}
                    className="restaurant__image" />
                <button
                    onClick={this.props.restaurantSelected.bind(null, this.state.currentRestaurant)}>
                    Yes Please
                </button>
                <button
                    onClick={this.distanceRejected.bind(null, this.state.currentRestaurant)}>
                    I don't feel like walking for {this.state.currentRestaurant.walkingMinutes.toFixed(1)} minutes today
                </button>
                <button onClick={this.restaurantRejected.bind(null, this.state.currentRestaurant)}>
                    I don't feel like this place today
                </button>
                {this.state.currentRestaurant.categories.map(c => {
                    return <button
                        key={c.alias}
                        onClick={this.categoryRejected.bind(null, c)}>
                        I don't feel like {c.title} today
                    </button>;
                })}

            </div>
        );
    }
}

RestaurantComponent.propTypes = {
    restaurants: React.PropTypes.array,
    restaurantSelected: React.PropTypes.func,
    noValidRestaurants: React.PropTypes.func,
    categoryRejected: React.PropTypes.func,
    distanceRejected: React.PropTypes.func,
};