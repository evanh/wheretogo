'use strict';

const Promise = require('bluebird');
const axios = require('axios');
const querystring = require('querystring');

const yelpAPI = 'https://api.yelp.com';

let ACCESS_DATA;

function getAPIKey() {
    return Promise.coroutine(function *g() {
        const apiKey = process.env.YELP_API_KEY;
        const apiSecret = process.env.YELP_API_SECRET;

        const body = {
            grant_type: 'client_credentials',
            client_id: apiKey,
            client_secret: apiSecret,
        };

        const response = yield axios.post(
            `${yelpAPI}/oauth2/token`, querystring.stringify(body));
        response.data.generated = new Date().getTime();
        ACCESS_DATA = response.data;
    })();
}

getAPIKey();

function checkToken() {
    const now = new Date().getTime();
    if (now > (ACCESS_DATA.generated + ACCESS_DATA.expires_in)) {
        return getAPIKey();
    }
    return Promise.resolve();
}

function getRestaurantsInRadius(req, res, next) {
    return Promise.coroutine(function *g() {
        yield checkToken();

        const qs = {
            radius: 2000,
            categories: 'restaurants',
            limit: 50,
            open_now: true,
        };
        if (req.query.latitude !== '' && req.query.longitude !== '') {
            qs.latitude = req.query.latitude;
            qs.longitude = req.query.longitude;
        }
        else {
            qs.location = req.query.location;
        }

        if (req.query.offset != null) {
            qs.offset = req.query.offset;
        }

        const options = {
            url: `${yelpAPI}/v3/businesses/search`,
            json: true,
            params: qs,
            headers: {
                Authorization: `Bearer ${ACCESS_DATA.access_token}`,
            },
        };

        const response = yield axios(options);
        res.send(200, response.data);
    })().catch(err => {
        console.log(err);
        if (err.response != null) {
            console.log(err.response.data);
        }
        throw err;
    });
}

function getRestaurantDetails(req, res, next) {
    return Promise.coroutine(function *g() {
        yield checkToken();

        const options = {
            url: `${yelpAPI}/v3/businesses/${req.params.businessID}`,
            json: true,
            headers: {
                Authorization: `Bearer ${ACCESS_DATA.access_token}`,
            },
        };

        const response = yield axios(options);
        res.send(200, response.data);
    })().catch(err => {
        console.log(err);
        if (err.response != null) {
            console.log(err.response.data);
        }
        throw err;
    });
}

module.exports = exports = {
    getRestaurantsInRadius: getRestaurantsInRadius,
    getRestaurantDetails: getRestaurantDetails,
};