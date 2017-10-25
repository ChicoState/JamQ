import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { ListPage } from '../list/list';
import { NowplayingPage } from '../nowplaying/nowplaying';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';


// import { OAuth } from 'oauthio-web';
import { OAuth } from 'oauth-phonegap';
import { OAuth as OAuthWeb } from 'oauthio-web';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  authenticated: any;
  isMobile: any;
  users: any;
  partyKey: any;
  // party: FirebaseListObservable<any>;
  party: FirebaseObjectObservable<any>;
  spotifyApi: any;
  // hostKey: any;
  // data: { hostKey: any };


  constructor(public navCtrl: NavController,public platform: Platform,
    public af: AngularFireDatabase, public afAuth: AngularFireAuth) {
    if (platform.is('cordova')) { this.isMobile = true; }
    else { this.isMobile = false; }

    if (sessionStorage["partyCookie"]>0) {
      this.partyKey = sessionStorage['partyCookie'];
    }


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
  }


  checkAuth(){
    // Pulls the spotify auth if cached and checks if currently Authenticated
    var spotify = OAuth.create('spotify');
    console.log("checking");
    // console.log(spotify.access_token);
    if(spotify.access_token) {
      this.authenticated = true;
    }
  }


  goHost() {
    //need to generate Host Key ID's Here
    var hostPage = "Your Host Key\n J534BS";
    //replaces previous page with key
    document.getElementById("keyPage").innerHTML = hostPage ;
    //reveals button to continue to host page
    document.getElementById("hide").style.visibility = "visible";
  }
  //navigates to and sets root Queue
  goQueue() {
    //create obj for passing key to next page
    // var data = { hostKey: this.key }
    //var uniquePartyKey = data.toString();
    sessionStorage["partyCookie"] = this.partyKey;

    //make sure that the key exists in the DB
    //if key is not in DB display alert and then go to home page again
    //Then enter party

    //takes user to queue with data containing party key
    this.navCtrl.setRoot(ListPage);
    //this.navCtrl.setRoot(NowplayingPage);
  }
  //navigates to and sets root to host now playing page
  newParty() {
    // this.data.hostKey = document.getElementById('party').innerHTML
    //later we can check this and make sure that there is not already a party with that number
    //later we can check if the user is already hosting a party
    var randomServerNum = Math.floor(1000 + Math.random() * 9000);
    this.partyKey= randomServerNum.toString();

    sessionStorage["partyCookie"] = this.partyKey;

    //create the db observable to manipulate
    this.party = this.af.object("/" + this.partyKey);
    let db = this.party;
    //gets the id of the spotify user and sets user to that id
    this.spotifyApi.getMe().then(function(data) {
      db.set({
        owner: data.body.id
      })
      }, function(err) { //error checking
      console.log('Something went wrong!', err);
    })

    //console.log(hostKeyMessage);
    //alert(uniquePartyKey);

    //create new table in db with corresponding key

    this.navCtrl.setRoot(NowplayingPage);
  }

  goParty() {
    this.navCtrl.setRoot(NowplayingPage);
  }

  ionViewDidLoad() {
    if (sessionStorage["partyCookie"]>0) {
      document.getElementById("goto").style.visibility =  "visible";
    }
    console.log('ionViewDidLoad NowplayingPage');
  }

}
