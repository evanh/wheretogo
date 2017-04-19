import React from 'react';
import {get} from 'axios';
// import Spinner from 'react-spinkit';
import shuffle from 'lodash/shuffle';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import StartButton from 'startButton.jsx';
import RestaurantComponent from 'restaurantComponent.jsx';
import SelectedRestaurant from 'selectedRestaurantComponent.jsx';
import Spinner from 'spinner.jsx';

import 'restaurant.scss';
import 'animations.scss';

export default class Main extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            status: 'not_started',
            restaurants: [],
            currentRestaurant: {},
            rejections: 0,
            selectedRestaurant: {},
            offset: 0,
            latitude: '',
            longitude: '',
            location: '',
            rejectedCategories: [],
            rejectedDistance: 2000,
        };

        this.restaurantSelected = this.restaurantSelected.bind(this);
        this.getStarted = this.getStarted.bind(this);
        this.setCurrentLocation = this.setCurrentLocation.bind(this);
        this.noMoreOptions = this.noMoreOptions.bind(this);
        this.addRejectedCategory = this.addRejectedCategory.bind(this);
        this.addRejectedDistance = this.addRejectedDistance.bind(this);
        this.restaurantRejected = this.restaurantRejected.bind(this);
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

            const filteredBusinesses = response.data.businesses.filter(b => {
                for (let i = 0; i < b.categories.length; i++) {
                    for (let c = 0; c < this.state.rejectedCategories.length; c++) {
                        if (b.categories[i].alias === this.state.rejectedCategories[c]) {
                            return false;
                        }
                    }
                }
                return b.distance < this.state.rejectedDistance;
            });

            // Increment offset and try again
            if (filteredBusinesses.length === 0) {
                return this.setState({
                    offset: this.state.offset + 50,
                }, () => {
                    return this.fetchRestaurants();
                });
            }

            this.setState({
                restaurants: shuffle(filteredBusinesses),
                status: 'in_use',
                offset: this.state.offset + 50,
            });
        }).catch(err => {
            console.log(err);
            this.setState({status: 'not_started'});
        });
    }

    restaurantSelected(restaurant) {
        this.setState({
            status: 'selected',
            selectedRestaurant: restaurant,
        });
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

    addRejectedCategory(category) {
        this.setState({
            rejectedCategories: this.state.rejectedCategories.concat([category.alias]),
            rejections: this.state.rejections + 1,
        });
    }

    addRejectedDistance(distance) {
        this.setState({
            rejectedDistance: distance,
            rejections: this.state.rejections + 1,
        });
    }

    restaurantRejected(restaurant) {
        console.log(restaurant.name);
        this.setState({
            rejectedOne: true,
            rejections: this.state.rejections + 1,
        });
    }

    render() {
        let component;
        let animation;
        let animationEnterTimeout;
        let animationLeaveTimeout;
        switch (this.state.status) {
            case 'not_started':
            case 'no_more_choices':
                animation = 'default';
                animationEnterTimeout = 100;
                animationLeaveTimeout = 100;
                component = <StartButton
                    key="started"
                    firstAttempt={this.state.offset === 0}
                    onClick={this.getStarted}
                />;
                break;
            case 'getting_location':
            case 'fetching_restaurants':
                animation = 'default';
                animationEnterTimeout = 100;
                animationLeaveTimeout = 100;
                component = <Spinner />
                break;
            case 'in_use':
                // TODO: Need to track current restaurant so we can switch
                // to a different animation for entry
                animation = 'default';
                animationEnterTimeout = 550;
                animationLeaveTimeout = 550;

                component = <RestaurantComponent
                    key="card"
                    restaurants={this.state.restaurants}
                    restaurantSelected={this.restaurantSelected}
                    restaurantRejected={this.restaurantRejected}
                    noValidRestaurants={this.noMoreOptions}
                    categoryRejected={this.addRejectedCategory}
                    distanceRejected={this.addRejectedDistance}
                />;
                break;
            case 'selected':
                animation = 'detail';
                animationEnterTimeout = 5000;
                animationLeaveTimeout = 5000;
                component = <SelectedRestaurant
                    key="detail"
                    restaurant={this.state.selectedRestaurant}
                    startAgain={this.state.getStarted} />;
                break;
        }

        return (
            <div>
                <CSSTransitionGroup
                    transitionName={animation}
                    transitionEnterTimeout={animationEnterTimeout}
                    transitionLeaveTimeout={animationLeaveTimeout}>
                    {component}
                </CSSTransitionGroup>
            </div>
        );
    }
}