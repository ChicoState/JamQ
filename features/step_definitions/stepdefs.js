const assert = require('assert');
const { Given, When, Then } = require('cucumber');

function register(password, verify, result) {
    if(password != verify) {
      return "Failed";//Show error.
    } else {
      if(result) {
        return "Worked";
        //Make user in firebase
      }
    }
    //Redirect to party page
  }

Given('A correct user name and password', function () {
  this.password = "password";
  this.verify = "password"; 
  this.result = true;
});

Given('A bad user name and password', function () {
  this.password = "password";
  this.verify = "passwor"; 
  this.result = true;
});

When('Register button is clicked', function () {
  this.register = register(this.password, this.verify, this.result);
});

Then('Throw error', function () {
  assert.equal(this.register, "Failed");
});

Then('Make a DJ', function () {
  assert.equal(this.register, "Worked");
});

//Song Search
/*
function searchSongs(data, length) {
  this.songslist = [];
  var songslist = this.songslist;
    
  //Get song data from spotify
  //function (data) {

  //Get all returned songs from search
  let songs = data;

  for (let i = 0; i < length; i++) {
    //Get data from each song and update the html with it

    let title = songs[i].name;
    let artist = songs[i].artists[0].name;
    let songid = songs[i].id;

    //Image may be absent
    let image;
    if (songs[i].album.images.length != 0) {
      image = "Image here";
    } else {
      //Use temp image
      image = "Image not found";
    }

    //Add the song the the list, html will be updated dyanmcally automagically
    songslist.push({ "title": title, "artist": artist, "image": image, "id": songid });
    return songlist[0].title;
  }
}

Given('Song name', function () {
  this.song1 = [];
  this.artist = [];
  this.artist.push({"name": "Artists Name"});
  this.song1.push({"name": "Song1 Name", "artists": this.artist, "id": "Song id"});
  this.data = [1];
  this.data[0] = this.song1;
});

When('Finished typing', function () {
  this.answer = searchSongs(this.data, this.length);
});

Then('Load song lists', function () {
  assert.equal(this.answer, "Song1 Name");
});
*/
//Login

function login(afToken) {
  var errorMessage = ""
  //Firebase authentication
    errorMessage = afToken;
    //alert(error)
    if(!errorMessage)
      return "Failed";
  if(errorMessage == true){
    //Login
    return "Signed in";
  }
}

Given('Correct user information', function () { this.afToken = true;
});

Given('Incorrect user information', function () {
  this.afToken = false;
});

When('User clicks button', function () {
  this.answer = login(this.afToken);
});

Then('Sign in', function () {
  assert.equal(this.answer, "Signed in");
});

Then('Error', function () {
  assert.equal(this.answer, "Failed");
});

//Checkroom

function checkroom(spotifytoken, roomnumber) {
    var roomref = roomnumber; //Acutally grab ref from firebase
    if (spotifytoken) {
      //Create playlist
      //Call Watch room
      return true;
    } else {
      //No Token
      return false;
    }
}

Given('No spotify token', function () {
  this.spotifytoken = false;
  this.roomnumber = "1234";
});

Given('A spotify token', function () {
  this.spotifytoken = true;
  this.roomnumber = "1234";
});

When('This runs', function () {
  this.answer = checkroom(this.spotifytoken, this.roomnumber);
});

Then('Make playlist', function () {
  assert.equal(this.answer, true);
});

Then('Do nothing', function () {
  assert.equal(this.answer, false);
});

//createPlaylist

function createplaylist(spotifytoken, roomnumber, data) {
  //Create spotify api
  //Set spotifytoken

  let exists = false;

  //spotify.getMe()
  // Get all user playlists
  //spotify.getUserPlaylists(data.body.id)
  var playlists = data;
  // Check if we already created this playlist
  for (var i = 0; i < playlists.length; i++) {
    if (playlists[i].name == 'JamQ' + roomnumber)
      exists = true;
  }
  //If we have not created a playlist for this room create one
  if (exists)
    return true;
  else 
    return false;
}

Given('A spotify token and room number', function () {
  this.spotifytoken = true;
  this.roomnumber = "1234";
  this.data = []
  this.data.push({"length": 1, "name": "JamQ1234"});
});

When('It runs', function () {
  this.answer = createplaylist(this.spotifytoken, this.roomnumber, this.data);
});

Then('Make the playlist', function () {
  assert.equal(this.answer, true);
});

//watchroom

function watchroom(roomnumber, spotifytoken, data, songid) {
  //Give ref to database song list
  //Create spotify api
  //Set spotify api token
  //get spotify data
  var playlists = data;
  var playlistid;
  // Find the playlist we are looking for
  for (var i = 0; i < playlists.length; i++) {
    if (playlists[i].name == 'JamQ' + roomnumber)
      playlistid = playlists[i];
  }
  var track = "spotify:track:" + songid;
  return track;
  //Add tracks to spotify
}

Given('Watch data', function () {
  this.spotifytoken = true;
  this.roomnumber = "1234";
  this.data = []
  this.data.push({"length": 1, "name": "JamQ1234"});
  this.songid = "Butts";
});

When('Watchroom runs', function () {
  this.answer = watchroom(this.spotifytoken, this.roomnumber, this.data, this.songid);
});

Then('Make the playlist on spotify', function () {
  assert.equal(this.answer, "spotify:track:Butts");
});
