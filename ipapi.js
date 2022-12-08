
'use strict';

var https = require('https');

var API_KEY = '';

var headers = { 'user-agent': 'ipapi/ipapi-nodejs/0.3' };

var fieldList = ['ip', 'city', 'region', 'country', 'postal',
    'latitude', 'longitude', 'timezone', 'latlong'];

var _request = async (path, callback, isJson) => new Promise(resolve => {
    https.get({
        host: 'ipapi.co',
        path: path,
        headers: headers
    }, resp => {
        var body = ''
        resp.on('data', data => body += data);
        resp.on('end', () => resolve(isJson ? callback(JSON.parse(body)) : callback(body)));
    }).on('error', e => callback(new Error(e)));
});

var location = async function (callback, ip, key, field) {
    var path;
    var isField = false;

    if (typeof callback !== 'function') {
        return 'Callback function is required';
    }

    if ((typeof field !== 'undefined') && (field !== '')) {
        if (fieldList.indexOf(field) === -1) {
            return 'Invalid field'
        } else {
            isField = true;
        }
    }

    if (isField) {
        if (typeof ip !== 'undefined') {
            path = '/' + ip + '/' + field + '/';
        } else {
            path = '/' + field + '/';
        }
    } else {
        if (typeof ip !== 'undefined') {
            path = '/' + ip + '/json/';
        } else {
            path = '/json/';
        }
    }

    if ((typeof key !== 'undefined') && (key !== '')) {
        path = path + '?key=' + key;
    } else {
        if (API_KEY !== '') {
            path = path + '?key=' + API_KEY;
        }
    }
    return _request(path, callback, (!isField))
};


/**
 * Query location for an IP address
 */
module.exports = {
    location: location,
};


/*  You can call API like this.
    *   var loc = await require('ipapi.co').location(x => x, 'your ip adress');
    *   console.log(loc);
 */
