var firebase = require("firebase");
var SpotifyWebApi = require('spotify-web-api-node');

var config = {
    apiKey: "AIzaSyCp9HMB336Zfcrl5spkAy4-w1nsrOe5wU0",
    authDomain: "jamq-b015a.firebaseapp.com",
    databaseURL: "https://jamq-b015a.firebaseio.com",
    storageBucket: "jamq-b015a.appspot.com"
};

firebase.initializeApp(config);

var database = firebase.database();

var rootref = database.ref('/parties/');

// When a new room is added, and for all existing rooms at start
rootref.on('child_added', function (snapshot) {

    // console.log(snapshot.val());
    // console.log(snapshot.key);
    // console.log("room added");

    // Begin watching that room
    checkroom(snapshot.key)
})

function checkroom(roomnumber) {

    var roomref = database.ref('/parties/' + roomnumber);

    roomref.once('value').then(function (snapshot) {

        var room = snapshot.toJSON();

        if ('spotifytoken' in room) {
            console.log("Room " + roomnumber + " spotify enabled");

            createplaylist(roomnumber, room.spotifytoken);
            watchroom(roomnumber, room.spotifytoken);

        } else {
            console.log("Room " + roomnumber + " is not spotify enabled");
        }

    });
}

function watchroom(roomnumber, spotifytoken) {

    console.log("Watching room: " + roomnumber);

    var songsref = database.ref('/parties/' + roomnumber + '/songlist/');

    songsref.on('child_added', function (snapshot) {

        var spotify = new SpotifyWebApi();
        spotify.setAccessToken(spotifytoken);

        spotify.getMe()
            .then(function (data) {

                spotify.getUserPlaylists(data.body.id)
                    .then(function (data) {
                        console.log('Got playlists!');


                        var playlists = data.body.items;

                        var playlistid;


                        // Find the playlist we are looking for
                        for (var i = 0; i < playlists.length; i++) {
                            if (playlists[i].name == 'JamQ' + roomnumber)
                                playlistid = playlists[i];
                        }


                        console.log(playlistid);
                        console.log(snapshot.toJSON());



                        spotify.getPlaylistTracks(playlistid.owner.id, playlistid.id)
                            .then(function (data) {

                            }




                        var track = "spotify:track:" + snapshot.toJSON().songid;

                        spotify.addTracksToPlaylist(playlistid.owner.id, playlistid.id, [track])
                            .then(function (data) {
                                console.log('Added tracks to playlist!');
                            }, function (err) {
                                console.log('Something went wrong in watchroom!', err);
                            });






                    }, function (err) {
                        console.log('Something went wrong!', err);
                    });


            }, function (err) {
                console.log('Something went wrong!', err);
            });


            



    });




    songsref.on('child_removed', function (snapshot) {

        var spotify = new SpotifyWebApi();
        spotify.setAccessToken(spotifytoken);

        spotify.getMe()
            .then(function (data) {

                spotify.getUserPlaylists(data.body.id)
                    .then(function (data) {
                        console.log('Got playlists!');


                        var playlists = data.body.items;

                        var playlistid;


                        // Find the playlist we are looking for
                        for (var i = 0; i < playlists.length; i++) {
                            if (playlists[i].name == 'JamQ' + roomnumber)
                                playlistid = playlists[i];
                        }


                        console.log(playlistid);
                        console.log(snapshot.toJSON());


                        var track = "spotify:track:" + snapshot.toJSON().songid;

                        spotify.removeTracksFromPlaylist(playlistid.owner.id, playlistid.id, [track])
                            .then(function (data) {
                                console.log('Added tracks to playlist!');
                            }, function (err) {
                                console.log('Something went wrong in watchroom remove!', err);
                            });






                    }, function (err) {
                        console.log('Something went wrong!', err);
                    });


            }, function (err) {
                console.log('Something went wrong!', err);
            });


            



    });
}

function createplaylist(roomnumber, spotifytoken) {
    var spotify = new SpotifyWebApi();
    spotify.setAccessToken(spotifytoken);

    let exists = false;

    spotify.getMe()
        .then(function (data) {
            console.log('Some information about the authenticated user', data.body);



            // Get all user playlists
            spotify.getUserPlaylists(data.body.id)
                .then(function (data) {
                    console.log('Got playlists!');


                    var playlists = data.body.items;


                    // Check if we already created this playlist
                    for (var i = 0; i < playlists.length; i++) {
                        if (playlists[i].name == 'JamQ' + roomnumber)
                            exists = true;
                    }





                }, function (err) {
                    console.log('Something went wrong!', err);
                }).then(function () {


                    //If we have not created a playlist for this room create one
                    if (!exists)
                        spotify.createPlaylist(data.body.id, 'JamQ' + roomnumber, { 'public': true })
                            .then(function (data) {
                                console.log('Created playlist!');
                            }, function (err) {
                                console.log('Something went wrong!', err);
                            });



                });






        }, function (err) {
            console.log('Something went wrong!', err);
        });


}