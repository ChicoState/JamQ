import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { OAuth as OAuthWeb } from 'oauthio-web';
import { OAuth } from 'oauth-phonegap';
import { Platform } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  spotify: any;
  spotifyApi: any;
  isMobile: any;

  constructor(
    private afAuth: AngularFireAuth, private platform: Platform,
    public navCtrl: NavController, public navParams: NavParams) {
      //checks if device is mobile or Web
    if (platform.is('cordova')) { this.isMobile = true; }
    else { this.isMobile = false; }

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
    //sets access token of authenticated user
    this.spotifyApi.setAccessToken(this.spotify.access_token);
  }

  spotifyLogin() {
    if (this.isMobile == true) {
      //is phone
      this.mobileAuth();
      let spotify = document.getElementById('spotify');
      let spotifyfull = document.getElementById('spotifyfull');
      spotify.style.visibility = "visible";
      spotify.innerHTML = "Spotify Signed In";
      let page = document.getElementById("page");
      spotifyfull.style.visibility = "hidden";
      page.replaceChild(spotify,spotifyfull);
    } else {
      //is web
      this.webAuth();
      let spotify = document.getElementById('spotify');
      let spotifyfull = document.getElementById('spotifyfull');
      spotify.style.visibility = "visible";
      spotify.innerHTML = "Spotify Signed In";
      let page = document.getElementById("page");
      spotifyfull.style.visibility = "hidden";
      page.replaceChild(spotify,spotifyfull);
    }
  }


  ionViewDidLoad() {
    if (this.spotify.access_token) {
      let spotify = document.getElementById('spotify');
      let spotifyfull = document.getElementById('spotifyfull');
      spotify.style.visibility = "visible";
      spotify.innerHTML = "Spotify Signed In";
      let page = document.getElementById("page");
      spotifyfull.style.visibility = "hidden";
      page.replaceChild(spotify,spotifyfull);
    }
    console.log('ionViewDidLoad ProfilePage');
  }

  //use for authentiating with mobile libraries
mobileAuth(){
  //initializes spotify auth
  OAuth.initialize('NJG7cpjPQHkVhSQgvpQi5MRoyM4');
  //popup for spotify login
  //then resets html to wait for auth to complete
    //idealy this would be a loading feature to wait until popup closes with success
  //on error sends alert  to page for debbuging
  let spotifyApi = this.spotifyApi;
    OAuth.popup('spotify',{cache: true}).done(function(spotify) {
      spotifyApi.setAccessToken(spotify.access_token);
    }).then(     ).fail(function(err) {
      alert("Error with spotify login");
    });

}
//use for authenticating with web libraries
webAuth() {
  var spotify = OAuthWeb.create('spotify');
  if(spotify.access_token){
    // console.log(spotify.access_token);

  } else {
  OAuthWeb.initialize('NJG7cpjPQHkVhSQgvpQi5MRoyM4');
    //popup for spotify login
    //then resets html to wait for auth to complete
      //idealy this would be a loading feature to wait until popup closes with success
    //on error sends alert  to page for debbuging
    let spotifyApi = this.spotifyApi;
      OAuthWeb.popup('spotify',{cache: true}).done(function(spotify) {
        spotifyApi.setAccessToken(spotify.access_token);
      }).then(       ).fail(function(err) {
        alert("Error with spotify login");
      });
    }

}



}
