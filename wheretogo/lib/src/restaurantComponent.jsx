import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Textfit } from 'react-textfit';

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
        this.priceRejected = this.priceRejected.bind(this);
    }

    componentDidMount() {
        this.setImageSize();
    }

    componentDidUpdate() {
        this.setImageSize();
    }

    setImageSize() {
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
        this.props.restaurantRejected(restaurant);
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

    priceRejected(restaurant) {
        this.restaurantFilter(r => r.price.length < restaurant.price.length);
        this.props.restaurantFilter(restaurant.price);
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
        let priceButton = `${this.state.currentRestaurant.price} is too much`;
        if (this.state.currentRestaurant.price === '') {
            priceButton = 'No price? No thanks';
        }
        return (
            <div className="row-flex restaurant">
                <CSSTransitionGroup
                    transitionName="restaurant-cycle"
                    transitionEnterTimeout={150}
                    transitionLeaveTimeout={150}>
                    <div key={this.state.currentRestaurant.name} className="restaurant__container">
                        <div className="column-flex restaurant__inner_container">
                            <div style={{position: 'relative'}}>
                                <div className="restaurant__categories">
                                    {this.state.currentRestaurant.categories.map(c => {
                                        return <div key={c.alias} className="restaurant__category_tag">
                                            <div>{c.title}</div>
                                        </div>;
                                    })}
                                </div>
                                <div
                                    id="image-container"
                                    className="restaurant__img_container"
                                    style={{"background-image": `url(${this.state.currentRestaurant.image_url})`}}>
                                </div>
                            </div>
                            <Textfit
                                mode="single"
                                forceSingleModeWidth={false}
                                className="restaurant__name">
                                {this.state.currentRestaurant.name}?
                            </Textfit>
                            <hr className="restaurant__divider" />
                            <Textfit
                                mode="single"
                                forceSingleModeWidth={false}
                                className="restaurant__name">
                                Price: {this.state.currentRestaurant.price || '?'}
                            </Textfit>
                            <hr className="restaurant__divider" />
                            <button
                                className="restaurant__button__yes"
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
                                onClick={this.priceRejected.bind(null, this.state.currentRestaurant)}>
                                {priceButton}
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
                </CSSTransitionGroup>
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
    priceRejected: React.PropTypes.func,
    restaurantRejected: React.PropTypes.func,
    restaurantFilter: React.PropTypes.func,
};