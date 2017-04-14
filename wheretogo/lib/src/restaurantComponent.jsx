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

    componentDidMount() {
        const $img = $('#yelp-image');
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
            <div className="restaurant column-flex">
                <div className="restaurant__container column-flex">
                    <div id="image-container" className="restaurant__img_container">
                        <img
                            id="yelp-image"
                            className="relative-centered"
                            src={this.state.currentRestaurant.image_url} />
                    </div>
                    <h2 className="restaurant__name">{this.state.currentRestaurant.name}?</h2>
                    <hr className="restaurant__divider" />
                    <button
                        className="restaurant__button"
                        onClick={this.props.restaurantSelected.bind(null, this.state.currentRestaurant)}>
                        Yes Please!
                    </button>
                    <hr className="restaurant__divider" />
                    <button
                        className="restaurant__button"
                        onClick={this.restaurantRejected.bind(null, this.state.currentRestaurant)}>
                        Not this place today
                    </button>
                    <button
                        className="restaurant__button"
                        onClick={this.distanceRejected.bind(null, this.state.currentRestaurant)}>
                        {this.state.currentRestaurant.walkingMinutes.toFixed(1)} minutes is too far
                    </button>
                    {this.state.currentRestaurant.categories.map(c => {
                        return <button
                            key={c.alias}
                            className="restaurant__button"
                            onClick={this.categoryRejected.bind(null, c)}>
                            No {c.title} today
                        </button>;
                    })}
                </div>
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