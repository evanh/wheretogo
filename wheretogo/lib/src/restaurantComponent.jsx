import React from "react";

export default class RestaurantComponent extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            topCategory: null,
        };
    }

    componentWillReceiveProps() {
        // set topCategory
    }

    render() {
        return (
            <div>
                <span>Google Map would go here</span>
                <button onClick={this.props.restaurantSelected}>Yes Please</button>
                <button onClick={this.props.restaurantRejected}>I don't feel like this place today</button>
                <button onClick={this.props.categoryRejected.bind(this.state.topCategory)}>I don't feel like {this.state.topCategory} today</button>
            </div>
        );
    }
}

RestaurantComponent.propTypes = {
    restaurant: React.PropTypes.object,
    restaurantSelected: React.PropTypes.func,
    restaurantRejected: React.PropTypes.func,
    categoryRejected: React.PropTypes.func,
};