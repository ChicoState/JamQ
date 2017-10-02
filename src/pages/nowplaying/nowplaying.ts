import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OAuth as OAuthWeb } from 'oauthio-web';
import { OAuth } from 'oauth-phonegap';
import { SpotifyWebApi } from 'spotify-web-api-node';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { Platform } from 'ionic-angular';


/**
 * Generated class for the NowplayingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nowplaying',
  templateUrl: 'nowplaying.html',
})
export class NowplayingPage {
items: Array<{title: string, note: string, icon: string,id: number}>;
songs: FirebaseListObservable<any>;
users: any;
songObj: string = '';
key: any;
isMobile: any;


  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, public af: AngularFireDatabase, public afAuth: AngularFireAuth) {
    if (platform.is('cordova')) { this.isMobile = true; }
      else { this.isMobile = false; }

    this.songs = af.list('/111/songlist', { query: { limitToLast: 10 } });
    //getting spotify api library
    var SpotifyWebApi = require('spotify-web-api-node');
    //build api with no params
    var spotifyApi = new SpotifyWebApi();
    if(this.isMobile) {
      //gets auth from cache named 'spotify'
      var spotify = OAuth.create('spotify');
    } else {
      //gets auth from cache named 'spotify' is Web
      var spotify = OAuthWeb.create('spotify');
    }

    //sets access token of authenticated user
    spotifyApi.setAccessToken(spotify.access_token);
    // gets user data from api and asynchronously throws it into page
      // checks if user has display name if not uses user id
      spotifyApi.getMe().then(function(data) {
        if (data.body.display_name){
          document.getElementById("name").innerHTML = data.body.display_name + "'s party";
        } else {
          document.getElementById("name").innerHTML = data.body.id + "'s party";
        }
      }, function(err) { //error checking
        console.log('Something went wrong!', err);
      })

     this.afAuth.authState.subscribe((auth) => {
     this.users = auth
    //  console.log(auth);
   });

   this.afAuth.auth.signInAnonymously().catch(function(error) {
     var errorMessage = error.message;
   });



  }

  chatSend(songTitle: string) {
        this.songs.push({ songTitle: songTitle, artist: "Artist Name" });
        this.songObj = '';
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NowplayingPage');
  }

  itemTapped(event, item) {
  }

}
