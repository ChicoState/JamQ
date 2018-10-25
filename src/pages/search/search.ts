import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, } from 'ionic-angular';
import { OAuth as OAuthWeb } from 'oauthio-web';
import { OAuth } from 'oauth-phonegap';
import { Platform } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ProfilePage } from '../profile/profile';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})

export class SearchPage {
  spotifyApi: any;
  songs: FirebaseListObservable<any>;
  artist: FirebaseListObservable<any>;
  user_list: FirebaseListObservable<any>;
  key: any;
  isMobile: any;
  that: this;
  spotify: any;
  searchbar: any;
  searchlist: any;

  //Store current song and artist list
  songslist: any;
  artistslist: any;
  searchcontents: any;

  constructor(
    public platform: Platform, public navCtrl: NavController,
    public navParams: NavParams, public af: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    public http: HttpClient) {

    this.afAuth.authState.subscribe(auth => {
      this.af.object(`users/${auth.uid}`).take(1).subscribe(data => {
        this.user_list = af.list("/" + partyKey + "/userlist/" + data.username + "/likes");
      });
    });

    //checks if device is mobile or Web
    if (platform.is('cordova')) { this.isMobile = true; }
    else { this.isMobile = false; }

    var partyKey = sessionStorage['partyCookie'];
    //console.log(partyKey);
    this.songs = af.list("/" + partyKey + "/songlist");
    //getting spotify api library
    var SpotifyWebApi = require('spotify-web-api-node');
    //build api with no params
    this.spotifyApi = new SpotifyWebApi();

    //switches Auth method based on if mobile or web
    if (this.isMobile) {
      //is phone
      //gets auth from cache named 'spotify'
      this.spotify = OAuth.create('spotify');
    } else {
      //is web
      //gets auth from cache named 'spotify'
      this.spotify = OAuthWeb.create('spotify');
      console.log("is Web");
    }


    //Get our spotify web token
    this.http.get('https://us-central1-jamq-b015a.cloudfunctions.net/getspotifytoken', { responseType: 'text' }).subscribe(data => {
      console.log("The auth token is " + data.toString());
      this.spotifyApi.setAccessToken(data);
    });


    // Set's the default tab to be songs
    this.searchlist = "songs";

    this.songslist = [];

    console.log(this.songslist);
  }

  getItems(event) {
    
    // Get the value in the serach bar
    let queryTerm = this.searchcontents;

    //Set our list to be visible
    document.getElementById("searchlist").style.visibility = "visible";

    // If the seach box is empty or only spaces were typed in
    if (queryTerm == null || queryTerm.trim() == "") {
      document.getElementById("searchlist").style.visibility = "hidden";
      return;
    }

    switch (this.searchlist) {
      case "songs":
        {
          this.searchSongs(queryTerm);
        }
        break;
      case "artists":
        {
          this.searchArtists(queryTerm);
        }
        break;
      case "generes":
        {
          this.searchGenres(queryTerm);
        }
        break;
      default:
        {
          console.log("Error! No tab selected!");
          return;
        }
    }
  }

  ionViewDidLoad() {
    if (this.spotify.access_token) {
      //do something here? or dont.
    }
    else {
      // alert("You need to sign into Spotify to search!");
      // this.navCtrl.setRoot(ProfilePage);
      /* let searchpage = document.getElementById('searchpage');
      let everything = document.getElementById('everything');
      this.searchbar = everything;
      // let addSpotify = document.getElementById('addSpotify');
      everything.parentNode.removeChild(everything);
      // searchpage.style.backgroundColor = 'grey';
      let img = document.createElement('img');
      img.setAttribute('src','https://static1.squarespace.com/static/551ed270e4b07f2b9a28489c/t/59848e13f7e0ab6f61df1b05/1501859351405/');
      img.style.alignContent = 'center';
      img.style.height = '50px';
      img.style.width = '50px';
      var spotifyauth = this.spotifyLogin.bind(this)
      img.onclick = spotifyauth;
      // img.setAttribute('onclick','this.spotifyLogin()');
      searchpage.replaceChild(img,searchpage.childNodes[0]); */
    }
    console.log('ionViewDidLoad SearchPage');
  }

  spotifyLogin() {
    let searchpage = document.getElementById('searchpage');

    if (this.isMobile == true) {
      //is phone
      this.mobileAuth();
      searchpage.replaceChild(this.searchbar, searchpage.childNodes[0])

    } else {
      //is web
      this.webAuth();
      searchpage.replaceChild(this.searchbar, searchpage.childNodes[0])
    }

  }

  itemTapped(index) {
    //get songid from song clicked
    var id = document.getElementById('title' + index).getAttribute("data-songid");
    //move songlist to loval variable
    var db = this.songs;
    var ul = this.user_list
    //call spotify api for song information
    this.spotifyApi.getTrack(id)
      .then(function (data) {
        //shorten call
        let track = data.body;
        //send track information to firebase
        var inqueue = false;
        var index;
        var key;
        var song_likes;
        //if song is in the queue, add one like
        //otherwise add to queue
        db.subscribe(songs => {
          for (index = 0; index < songs.length; index++) { //for loop to search for songid
            if (songs[index].songid == id) {
              key = songs[index].$key;
              song_likes = songs[index].likes;
              inqueue = true;
              break;
            }
          }
        })
        if (inqueue == false) {
          db.push({
            artist: track.artists['0'].name,
            title: track.name,
            songid: id,
            img: track.album.images['0'].url,

            //maybe make a new table with likes columns of users who liked it and new table of users who disliked it
            likes: 1,// change to spotify users
            //dislikes: 0 // change to spotify users
          });
          ul.push({
            song: track.name,
            likes: 1,
          });

        } else {


          db.update(key, { likes: song_likes + 1 }); //likes update
        }

      }, function (err) { //error checking
        console.log('Something went wrong!', err);
      });
  }

  //use for authentiating with mobile libraries
  mobileAuth() {
    //initializes spotify auth
    OAuth.initialize('NJG7cpjPQHkVhSQgvpQi5MRoyM4');
    //popup for spotify login
    //then resets html to wait for auth to complete
    //idealy this would be a loading feature to wait until popup closes with success
    //on error sends alert  to page for debbuging
    let spotifyApi = this.spotifyApi;
    OAuth.popup('spotify', { cache: true }).done(function (spotify) {
      spotifyApi.setAccessToken(spotify.access_token);
    }).then().fail(function (err) {
      alert("Error with spotify login");
    });

  }

  //use for authenticating with web libraries
  webAuth() {
    var spotify = OAuthWeb.create('spotify');
    if (spotify.access_token) {
      // console.log(spotify.access_token);

    } else {
      OAuthWeb.initialize('NJG7cpjPQHkVhSQgvpQi5MRoyM4');
      //popup for spotify login
      //then resets html to wait for auth to complete
      //idealy this would be a loading feature to wait until popup closes with success
      //on error sends alert  to page for debbuging
      let spotifyApi = this.spotifyApi;
      OAuthWeb.popup('spotify', { cache: true }).done(function (spotify) {
        spotifyApi.setAccessToken(spotify.access_token);
      }).then().fail(function (err) {
        alert("Error with spotify login");
      });
    }

  }


  //Search for and populate list of songs
  searchSongs(queryTerm: String) {

    //Each query should have a new list
    this.songslist = [];

    //This magically lets you use songlist inside a promise
    var songslist = this.songslist;

    this.spotifyApi.searchTracks(queryTerm, { limit: 50 })
      .then(function (data) {

        //Get all returned songs from search
        let songs = data.body.tracks.items;

        for (let i = 0; i < songs.length; i++) {
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
          songslist.push({"title": title, "artist": artist, "image": image, "id": songid});
        }
      })
  }

  //Search for and populate list of artists
  searchArtists(queryTerm: String) {

    //Each query should have a new list
    this.artistslist = [];

    //This magically lets you use songlist inside a promise
    var artistslist = this.artistslist;

    this.spotifyApi.searchArtists(queryTerm, { limit: 50 })
      .then(function (data) {
        //Get all returned artists from search
        let artists = data.body.artists.items;

        for (let i = 0; i < artists.length; i++) {
          //Get data from each artist and update the html with it
          let name = artists[i].name;

          //Image may be absent
          let image;
          if (artists[i].images.length != 0) {  
            image = artists[i].images[0].url;
          } else {
            //Use temp image
            image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS87NixlNcf6A52z5o0v8Lx-wcwdQlxOTjc4AwWzEALPSQk0VuStw"
          }

          //Add the artist the the list, html will be updated dyanmcally automagically
          artistslist.push({"name": name, "image": image});
        }
      })
  }

  //Search for and populate list of generes
  searchGenres(queryTerm: String) {

  }

}
