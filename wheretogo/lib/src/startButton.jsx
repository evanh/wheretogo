import React from 'react';
import {TransitionMotion, spring} from 'react-motion';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

export default class StartButton extends React.Component {
    constructor(props){
        super(props);
    }

    willLeave() {
        return {scale: spring(0.3)};
    }

    render() {
        const buttonText = this.props.firstAttempt ? 'Get Started' : 'Try Again?';
        return (
            <div className='centered start-button'>
                <button key="button" className="started__button" onClick={this.props.onClick}>{buttonText}</button>
            </div>
        );
    }
}

StartButton.propTypes = {
    show: React.PropTypes.bool,
    firstAttempt: React.PropTypes.bool,
    onClick: React.PropTypes.func,
};