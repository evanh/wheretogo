import React from 'react';
import {get} from 'axios';
import Spinner from 'react-spinkit';

import StartButton from 'startButton.jsx';
import RestaurantComponent from 'restaurantComponent.jsx';

import 'restaurant.scss';

export default class Main extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            status: 'not_started',
            restaurants: [],
            offset: 0,
            latitude: '',
            longitude: '',
            location: '',
        };

        this.restaurantSelected = this.restaurantSelected.bind(this);
        this.getStarted = this.getStarted.bind(this);
        this.setCurrentLocation = this.setCurrentLocation.bind(this);
        this.noMoreOptions = this.noMoreOptions.bind(this);
    }

    fetchRestaurants() {
        return get('/restaurants', {
            params: {
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                offset: this.state.offset,
            }
        }).then(response => {
            if (response.data.businesses == null || response.data.businesses.length === 0) {
                this.setState({status: 'no_more_choices'});
                return;
            }

            this.setState({
                restaurants: response.data.businesses,
                status: 'in_use',
                offset: this.state.offset + 50,
            });
        }).catch(err => {
            console.log(err);
            this.setState({status: 'not_started'});
        });
    }

    restaurantSelected() {
        // Use nextRestaurant to celebrate
    }

    setCurrentLocation(position, callback) {
        console.log('LOCATION FOUND', position);
        this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            status: 'fetching_restaurants',
        }, callback);
    }

    cannotGetLocation(error) {
        console.log('NO LOCATION', error);
    }

    componentDidUpdate() {
        switch (this.state.status) {
            case 'getting_location':
                navigator.geolocation.getCurrentPosition(
                    this.setCurrentLocation, this.cannotGetLocation);
                break;
            case 'fetching_restaurants':
                this.fetchRestaurants();
                break;
        }
    }

    getStarted() {
        if (!navigator.geolocation) {
            console.log('NO LOCATION DATA');
            return;
        }

        this.setState({status: 'getting_location'});
    }

    noMoreOptions() {
        console.log('NO VALID RESTAURANTS');
        this.setState({status: 'fetching_restaurants'});
    }

    render() {
        let component;
        switch (this.state.status) {
            case 'not_started':
            case 'no_more_choices':
                component = <StartButton
                    firstAttempt={this.state.offset === 0}
                    onClick={this.getStarted}
                />;
                break;
            case 'getting_location':
            case 'fetching_restaurants':
                component = <Spinner
                    noFadeIn="true"
                    className="centered"
                    spinnerName='cube-grid' />;
                break;
            case 'in_use':
                component = <RestaurantComponent
                    restaurants={this.state.restaurants}
                    restaurantSelected={this.restaurantFound}
                    noValidRestaurants={this.noMoreOptions}
                />;
                break;
        }

        return (
            <div>
                {component}
            </div>
        );
    }
}