import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Platform } from 'ionic-angular';
import { User } from '../../models/user';
import {
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable
} from "angularfire2/database";
import "rxjs/add/operator/map";

@IonicPage()
@Component({
  selector: 'page-nowplaying',
  templateUrl: 'nowplaying.html',
})
export class NowplayingPage {
  songs: FirebaseListObservable<any>;
  owner: FirebaseObjectObservable<any>;
  users: any;
  user = {} as User;
  key: any;
  isMobile: any;
  spotifyApi: any;
  partyKey: any;
  host: any;
  username: any;

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public afAuth: AngularFireAuth
  ) {
    if (platform.is('cordova')) { this.isMobile = true; }
    else { this.isMobile = false; }

    this.afAuth.authState.subscribe(auth => {
      this.af.object(`users/${auth.uid}`).take(1).subscribe(data => {
        this.username = data.username;
      });
    });

    this.partyKey = sessionStorage['partyCookie'];
    // this.songs = af.list("/" + this.partyKey + "/songlist", { query: { limitToLast: 10 } });
    this.songs = af.list("/" + this.partyKey + "/songlist", {
      //toString(parseInt('likes') - parseInt('dislikes'))
      query: {
        //orderByChild: toString( (parseInt('likes') - parseInt('dislikes'))  ,
        orderByChild: "likes",
        limitToLast: 15
      }
    });
    this.owner = af.object("/" + this.partyKey);
    this.owner.subscribe(snapshot => (this.host = snapshot.owner));
    //this.songs = af.list("/333/songlist", { query: { limitToLast: 10 } });

    //This shows the party number at the top
    //document.getElementById("partyNum").innerHTML = partyKey.body;

    //getting spotify api library
    // var SpotifyWebApi = require('spotify-web-api-node');
    //build api with no params
    // this.spotifyApi = new SpotifyWebApi();
    // if(this.isMobile) {
    //gets auth from cache named 'spotify'
    //   var spotify = OAuth.create('spotify');
    // } else {
    //gets auth from cache named 'spotify' is Web
    // var spotify = OAuthWeb.create('spotify');
    // }
    //sets access token of authenticated user
    // this.spotifyApi.setAccessToken(spotify.access_token);

    // gets user data from api and asynchronously throws it into page
    // checks if user has display name if not uses user id
    // this.spotifyApi.getMe().then(function(data) {
    //   if (data.body.display_name){
    //     document.getElementById("name").innerHTML = data.body.display_name + "'s party";
    //   } else {
    //     document.getElementById("name").innerHTML = data.body.id + "'s party";
    //   }
    // }, function(err) { //error checking
    //   console.log('Something went wrong!', err);
    // })


    //signs into firebase using anonymous user
    //  this.afAuth.auth.signInAnonymously().catch(function(error) {
    //    var errorMessage = error.message;
    //  });
  }

  remove(songid) {
    this.songs.forEach(song => {
      song.forEach(song => {
        if (song.songid == songid) {
          this.songs.remove(song.$key);
        }
      })
    });
  }

  ionViewDidLoad() {
    try {
      this.afAuth.authState.subscribe((auth) => {
        //  console.log(auth)
      });
    } catch (e) { }
    console.log('ionViewDidLoad NowplayingPage');
  }



  
}
