import React from "react";

export default class StartButton extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const buttonText = this.props.firstAttempt ? "Get Started" : "Try Again?";
        return (
            <div>
                <button onClick={this.props.onClick}>{buttonText}</button>
            </div>
        );
    }
}

StartButton.propTypes = {
    show: React.PropTypes.bool,
    firstAttempt: React.PropTypes.bool,
    onClick: React.PropTypes.func,
};