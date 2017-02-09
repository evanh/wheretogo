import React from 'react';
import { render } from 'react-dom';

import 'babel-polyfill';

// components
import Main from 'main.jsx';

function ajax(options){
    return new Promise((resolve, reject) => {
        $.ajax(options).then(d => {
            resolve(d);
        }, e => {
            reject(e);
        });
    });
};

Object.assign(window.utils = {}, {
    ajax,
});

render(
    <Main />,
    document.getElementById('root')
);