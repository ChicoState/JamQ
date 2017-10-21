import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OAuth as OAuthWeb } from 'oauthio-web';
import { OAuth } from 'oauth-phonegap';
import { SpotifyWebApi } from 'spotify-web-api-node';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-nowplaying',
  templateUrl: 'nowplaying.html',
})
export class NowplayingPage {
songs: FirebaseListObservable<any>;
users: any;
key: any;
isMobile: any;
spotifyApi: any;


  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public af: AngularFireDatabase, public afAuth: AngularFireAuth) {
    if (platform.is('cordova')) { this.isMobile = true; }
      else { this.isMobile = false; }


    this.songs = af.list('/333/songlist', { query: { limitToLast: 10 } });
    //getting spotify api library
    var SpotifyWebApi = require('spotify-web-api-node');
    //build api with no params
    this.spotifyApi = new SpotifyWebApi();
    if(this.isMobile) {
      //gets auth from cache named 'spotify'
      var spotify = OAuth.create('spotify');
    } else {
      //gets auth from cache named 'spotify' is Web
      var spotify = OAuthWeb.create('spotify');
    }
    //sets access token of authenticated user
    this.spotifyApi.setAccessToken(spotify.access_token);

      // gets user data from api and asynchronously throws it into page
      // checks if user has display name if not uses user id
      this.spotifyApi.getMe().then(function(data) {
        if (data.body.display_name){
          document.getElementById("name").innerHTML = data.body.display_name + "'s party";
        } else {
          document.getElementById("name").innerHTML = data.body.id + "'s party";
        }
      }, function(err) { //error checking
        console.log('Something went wrong!', err);
      })

     this.afAuth.authState.subscribe((auth) => {
     this.users = auth;
    //  console.log(this.users);
   });

   //signs into firebase using anonymous user
   this.afAuth.auth.signInAnonymously().catch(function(error) {
     var errorMessage = error.message;
   });
}

  remove(songid) {
    this.songs.forEach(song => {
      song.forEach(song => {
      if(song.songid == songid) {
        this.songs.remove(song.$key);
      }
      })
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NowplayingPage');
  }

}
