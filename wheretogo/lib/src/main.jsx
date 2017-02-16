import React from "react";
import {coroutine} from "bluebird";

import StartButton from "startButton.jsx";
import RestaurantComponent from "restaurantComponent.jsx";

export default class Main extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            started: false,
            restaurants: [],
            nextRestaurant: null,
            attempts: 0,
        };

        this.restaurantSelected.bind(this);
        this.restaurantRejected.bind(this);
        this.categoryRejected.bind(this);
        this.getStarted.bind(this);
    }

    fetchRestaurants() {

    }

    restaurantSelected() {
        // Use nextRestaurant to celebrate
    }

    restaurantRejected() {
        // Filter nextRestaurant from list
        this.findNextRestaurant();
    }

    categoryRejected(category) {
        // Filter all restaurants with this category
        this.findNextRestaurant();
    }

    getStarted() {
        // remove started button and show restaurant
        this.fetchRestaurants();
        this.findNextRestaurant();
    }

    findNextRestaurant() {
        // Set nextRestaurant
        // If no more options, increment attempt and start started = false
    }

    render() {
        return (
            <div>
                <StartButton
                    show={this.state.started === false}
                    firstAttempt={this.attempts === 0}
                    onClick={this.getStarted}
                />
                <RestaurantComponent
                    restaurant={this.state.nextRestaurant}
                    restaurantSelected={this.restaurantFound}
                    restaurantRejected={this.restaurantRejected}
                    categoryRejected={this.categoryRejected}
                />
            </div>
        );
    }
}