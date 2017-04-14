import React from 'react';

export default class StartButton extends React.Component {
    constructor(props){
        super(props);
    }

    componentWillLeave(callback) {
        setTimeout(callback, 4000);
    }

    render() {
        const buttonText = this.props.firstAttempt ? 'What do I feel like today?' : 'Try Again?';
        return (
            <div className='centered'>
                <button className="action-button started__button" onClick={this.props.onClick}>{buttonText}</button>
            </div>
        );
    }
}

StartButton.propTypes = {
    show: React.PropTypes.bool,
    firstAttempt: React.PropTypes.bool,
    onClick: React.PropTypes.func,
};