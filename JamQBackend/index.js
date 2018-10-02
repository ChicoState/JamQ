"use strict" // Better Javascript rules

let http = require('http'); // HTTP Server
let SpotifyWebApi = require('spotify-web-api-node'); // Spotify API

// This is our secret
let clientId = '4474ee93290c4832bd8821a0a22143ce';
let clientSecret = 'df84c60402204f04a0fb4c01c55343f7';

// Create the API object with the credentials
let spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Create an HTTP server and start listening on port 8080
http.createServer(function (request, result) {
    // Retrieve an access token token from Spotify.
    spotifyApi.clientCredentialsGrant().then(
        function (data) {
            console.log('The access token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);

            //Return the token to the requestor as plain text
            result.writeHead(200, { 'Content-Type': 'text/plain' });
            result.end(data.body['access_token']);
        },
        function (err) {
            console.log('Something went wrong when retrieving an access token', err);
        }
    );
}).listen(8080);