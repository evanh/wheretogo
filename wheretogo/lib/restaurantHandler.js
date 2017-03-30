'use strict';

const Promise = require('bluebird');
const axios = require('axios');
const querystring = require('querystring');

const yelpAPI = 'https://api.yelp.com';

function getAPIKey() {
    return Promise.coroutine(function *g() {
        const apiKey = 'BHmyv9NdA24zpB72GlsySw';// process.env.YELP_API_KEY;
        const apiSecret = 'SwozyQZADOFkf820NBlXz7YAdfW58RHdvQrxvJh08CAynRkxoXxW9YgWiHyvv8JJ';//process.env.YELP_API_SECRET;

        const body = {
            grant_type: 'client_credentials',
            client_id: apiKey,
            client_secret: apiSecret,
        };

        const response = yield axios.post(
            `${yelpAPI}/oauth2/token`, querystring.stringify(body));
        return response.data.access_token;
    })();
}

function getRestaurantsInRadius(req, res, next) {
    return Promise.coroutine(function *g() {
        const accessToken = yield getAPIKey();

        const qs = {
            radius: 2000,
            categories: 'restaurants',
            limit: 50,
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
                Authorization: `Bearer ${accessToken}`,
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
};