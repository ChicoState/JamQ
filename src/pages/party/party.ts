import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { OAuth as OAuthWeb } from "oauthio-web";
import { OAuth } from "oauth-phonegap";
import { Platform } from "ionic-angular";
import {
  AngularFireDatabase,
} from "angularfire2/database";
import { FirebaseObjectObservable } from 'angularfire2/database';
import { User } from '../../models/user';
import { SlidesPage } from '../slides/slides';
import { ListPage } from '../list/list';
import { NowplayingPage } from '../nowplaying/nowplaying';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';
import { ProfilePage } from '../profile/profile';


/**
 * Generated class for the PartyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-party',
  templateUrl: 'party.html',
})
export class PartyPage {
  spotify: any;
  spotifyApi: any;
  isMobile: any;
  user = {} as User;
  userJoin: any;//FirebaseListObservable<any>;
  // userHost: FirebaseListObservable<any>;
  userHost: any;
  authenticated: any;
  partyKey: any;
  party: FirebaseObjectObservable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    //private toast: ToastController,
    private platform: Platform,
    public menuCtrl: MenuController,
    public af: AngularFireDatabase,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController
  ) {


    // this.afAuth.authState.subscribe(auth => {
    //   this.afDatabase.list(`users/${auth.uid}/hosted`).subscribe(data => {
    //     console.log(data)
    //     this.userHost = data;
    //   });
    //   this.userJoin = this.afDatabase.list(`users/${auth.uid}`);
    //   console.log(this.userHost);
    //   this.afDatabase.object(`users/${auth.uid}`).take(1).subscribe(userdata => {
    //     // console.log(userdata.username);
    //     this.user.username = userdata.username;
    //   });
    // })

    // this.afAuth.authState.subscribe(auth => {

    //   let userid = auth.uid;

    //   this.afDatabase.database.ref('users/' + userid).once('value').then(() => {
    //     this.user.username;

    //   })
    // })

    this.afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        var user_ = this.user;
        this.afDatabase.database.ref('users/' + user.uid + '/username').once('value').then(function (snapshot) {
          user_.username = snapshot.val();
          console.log(user_);
        })
      }
    }
    );

    console.log("username is " + this.user.username)
    //checks if device is mobile or Web
    if (platform.is("cordova")) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }

    //getting spotify api library
    var SpotifyWebApi = require("spotify-web-api-node");
    //build api with no params
    this.spotifyApi = new SpotifyWebApi();

    //switches Auth method based on if mobile or web
    if (this.isMobile) {
      //is phone
      //gets auth from cache named 'spotify'
      this.spotify = OAuth.create("spotify");
    } else {
      //is web
      //gets auth from cache named 'spotify'
      this.spotify = OAuthWeb.create("spotify");
      console.log("is Web");

      if (sessionStorage["partyCookie"] > 0) {
        this.partyKey = sessionStorage['partyCookie'];
      }
    }
    //sets access token of authenticated user
    this.spotifyApi.setAccessToken(this.spotify.access_token);
  }

  ionViewDidLoad() {
    if (this.spotify.access_token) {
      let spotify = document.getElementById("spotify");
      let spotifyfull = document.getElementById("spotifyfull");
      spotify.style.visibility = "visible";
      spotify.innerHTML = "Spotify Signed In";
      let page = document.getElementById("page");
      spotifyfull.style.visibility = "hidden";
      page.replaceChild(spotify, spotifyfull);
    }
    // this.afAuth.authState.subscribe(data => {
    //   this.userHost = this.afDatabase.list(`users/${data.uid}/hosted`);
    //   this.userJoin = this.afDatabase.list(`users/${data.uid}/joined`);
    // });
    console.log("ionViewDidLoad ProfilePage");
  }

  mobileAuth() {
    //initializes spotify auth
    OAuth.initialize("NJG7cpjPQHkVhSQgvpQi5MRoyM4");
    //popup for spotify login
    //then resets html to wait for auth to complete
    //idealy this would be a loading feature to wait until popup closes with success
    //on error sends alert  to page for debbuging
    let spotifyApi = this.spotifyApi;
    OAuth.popup("spotify", { cache: true })
      .done(function (spotify) {
        spotifyApi.setAccessToken(spotify.access_token);
      })
      .then()
      .fail(function (err) {
        alert("Error with spotify login");
      });
  }
  //use for authenticating with web libraries
  webAuth() {
    var spotify = OAuthWeb.create("spotify");
    if (spotify.access_token) {
      // console.log(spotify.access_token);
    } else {
      OAuthWeb.initialize("NJG7cpjPQHkVhSQgvpQi5MRoyM4");
      //popup for spotify login
      //then resets html to wait for auth to complete
      //idealy this would be a loading feature to wait until popup closes with success
      //on error sends alert  to page for debbuging
      let spotifyApi = this.spotifyApi;
      OAuthWeb.popup("spotify", { cache: true })
        .done(function (spotify) {
          spotifyApi.setAccessToken(spotify.access_token);
        })
        .then()
        .fail(function (err) {
          alert("Error with spotify login");
        });
    }
  }

  goQueue() {
    // this.partyKey = document.getElementById('party').innerHTML
    //create obj for passing key to next page
    let prompt = this.alertCtrl.create({
      title: 'Enter the party # you want to join',
      //message: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Party Number'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            //Do nothing just go back to the profile page
          }
        },
        {
          text: 'Join',
          handler: data => {
            console.log(data.title);
            var uniquePartyKey = parseInt(data.title);
            //console.log(uniquePartyKey);
            if (isNaN(uniquePartyKey)) {
              alert("Please enter a party number");
              return;
            } else if (uniquePartyKey < 1000 || uniquePartyKey > 9999) {
              // later we should check if the party already exists in the db
              alert("Party number does not exist"); // later we should check if the party already exists in the db
              return;
            }

            sessionStorage["partyCookie"] = data.title;
            sessionStorage["role"] = "guest";
            //maybe later have it check if its your party or not

            //Will need to push joined party to user in DB

            //remove user menu options
            this.menuCtrl.enable(true, "user");
            this.menuCtrl.enable(false, "host");

            //takes user to queue with data containing party key
            this.userJoin.push({ joined: this.partyKey });
            this.navCtrl.setRoot(ListPage);
          }
        }
      ]
    });
    prompt.present();
  }

  //navigates to and sets root to host now playing page
  newParty() {
    //later we can check this and make sure that there is not already a party with that number
    //later we can check if the user is already hosting a party
    var randomServerNum = Math.floor(1000 + Math.random() * 9000);
    this.partyKey = randomServerNum.toString();

    sessionStorage["partyCookie"] = this.partyKey;
    sessionStorage["role"] = "host"; //maybe later have it check if its your party or not

    //create the db observable to manipulate
    this.party = this.af.object("/" + this.partyKey);
    let db = this.party;
    console.log("user name in newpart is: ")
    console.log(this.user.username);
    this.afAuth.authState.subscribe(data => {
      db.set({
        owner: this.user.username
      });
    });

    //create new table in db with corresponding key

    //eable host menu/disable user
    this.menuCtrl.enable(false, "user");
    this.menuCtrl.enable(true, "host");
    this.userHost.push({ hosted: this.partyKey });
    this.navCtrl.setRoot(NowplayingPage);
  }

  goParty() {
    //create obj for passing key to next page
    //var data = { hostKey: this.partyKey };
    //var uniquePartyKey = data.toString();
    var uniquePartyKey = parseInt(this.partyKey);
    //console.log(uniquePartyKey);
    if (isNaN(uniquePartyKey)) {
      alert("Please enter a party number");
      return;
    } else if (uniquePartyKey < 1000 || uniquePartyKey > 9999) {
      // later we should check if the party already exists in the db
      alert("Party number does not exist");
      return;
    }

    sessionStorage["partyCookie"] = this.partyKey;
    sessionStorage["role"] = "host"; //maybe later have it check if its your party or not
    this.navCtrl.setRoot(NowplayingPage);
    this.menuCtrl.enable(false, "user");
    this.menuCtrl.enable(true, "host");
  }

  myParty() {
    sessionStorage["partyCookie"] = this.partyKey;
    this.menuCtrl.enable(false, "user");
    this.menuCtrl.enable(true, "host");
    this.navCtrl.setRoot(NowplayingPage);
  }
}
