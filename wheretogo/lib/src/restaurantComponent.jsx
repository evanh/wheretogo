import React from 'react';

export default class RestaurantComponent extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            topCategory: null,
            currentRestaurant: props.restaurants[0],
            restaurants: [...props.restaurants],
        };

        this.restaurantSelected = this.restaurantSelected.bind(this);
        this.restaurantRejected = this.restaurantRejected.bind(this);
        this.categoryRejected = this.categoryRejected.bind(this);
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
                <button onClick={this.props.restaurantSelected}>Yes Please</button>
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
};