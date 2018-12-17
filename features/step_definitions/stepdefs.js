const assert = require('assert');
const { Given, When, Then } = require('cucumber');

function register(password, verify, result) {
    if(password != verify) { return "Failed";
    } else {
      if(result) {
        return "Worked";
        //Make user in firebase
      }
    }
    //Redirect to party page
  }

/* function searchSongs(data, length) {
    //Each query should have a new list
    this.songslist = [];

    //This magically lets you use songlist inside a promise
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
            image = songs[i].album.images[0].url;
          } else {
            //Use temp image
            image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS87NixlNcf6A52z5o0v8Lx-wcwdQlxOTjc4AwWzEALPSQk0VuStw"
          }

          //Add the song the the list, html will be updated dyanmcally automagically
          songslist.push({ "title": title, "artist": artist, "image": image, "id": songid });
          return songlist[0].title;
        }
      }*/

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
/*
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
});*/
