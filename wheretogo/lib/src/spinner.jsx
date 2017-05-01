import React from 'react';

import 'spinner.scss';

export default class Spinner extends React.Component {
    render() {
        const cells = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        return (
            <div className="centered spinner">
                {cells.map(c => {
                    return <div className={"spinner__cell"} />;
                })}
            </div>
        );
    }
}

Spinner.propTypes = {
};