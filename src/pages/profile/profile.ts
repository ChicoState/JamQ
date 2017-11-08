import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AngularFireAuth } from "angularfire2/auth";
import { OAuth as OAuthWeb } from "oauthio-web";
import { OAuth } from "oauth-phonegap";
import { Platform } from "ionic-angular";
import {
  AngularFireDatabase,
  FirebaseListObservable
} from "angularfire2/database";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  spotify: any;
  spotifyApi: any;
  isMobile: any;

  constructor(
    private afAuth: AngularFireAuth,
    private platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
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
    }
    //sets access token of authenticated user
    this.spotifyApi.setAccessToken(this.spotify.access_token);
  }

  spotifyLogin() {
    if (this.isMobile == true) {
      //is phone
      this.mobileAuth();
      let spotify = document.getElementById("spotify");
      let spotifyfull = document.getElementById("spotifyfull");
      spotify.style.visibility = "visible";
      spotify.innerHTML = "Spotify Signed In";
      let page = document.getElementById("page");
      spotifyfull.style.visibility = "hidden";
      page.replaceChild(spotify, spotifyfull);
    } else {
      //is web
      this.webAuth();
      let spotify = document.getElementById("spotify");
      let spotifyfull = document.getElementById("spotifyfull");
      spotify.style.visibility = "visible";
      spotify.innerHTML = "Spotify Signed In";
      let page = document.getElementById("page");
      spotifyfull.style.visibility = "hidden";
      page.replaceChild(spotify, spotifyfull);
    }
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
    console.log("ionViewDidLoad ProfilePage");
  }

  //use for authentiating with mobile libraries
  mobileAuth() {
    //initializes spotify auth
    OAuth.initialize("NJG7cpjPQHkVhSQgvpQi5MRoyM4");
    //popup for spotify login
    //then resets html to wait for auth to complete
    //idealy this would be a loading feature to wait until popup closes with success
    //on error sends alert  to page for debbuging
    let spotifyApi = this.spotifyApi;
    OAuth.popup("spotify", { cache: true })
      .done(function(spotify) {
        spotifyApi.setAccessToken(spotify.access_token);
      })
      .then()
      .fail(function(err) {
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
        .done(function(spotify) {
          spotifyApi.setAccessToken(spotify.access_token);
        })
        .then()
        .fail(function(err) {
          alert("Error with spotify login");
        });
    }
  }
  goQueue() {}
  newParty() {}
  goParty() {}

  /*
  goQueue() {
    // this.partyKey = document.getElementById('party').innerHTML
    //create obj for passing key to next page
    var data = { hostKey: this.partyKey };
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
    sessionStorage["role"] = "guest"; //maybe later have it check if its your party or not

    //make sure that the key exists in the DB
    //if key is not in DB display alert and then go to home page again
    //Then enter party

    //remove user menu pptions
    this.menuCtrl.enable(true, "user");
    this.menuCtrl.enable(false, "host");

    //takes user to queue with data containing party key
    this.navCtrl.setRoot(ListPage, data);
    //this.navCtrl.setRoot(NowplayingPage);
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
    this.afAuth.authState.subscribe(data => {
      db.set({
        owner: data.email
      });
    });

    //create new table in db with corresponding key

    //eable host menu/disable user
    this.menuCtrl.enable(false, "user");
    this.menuCtrl.enable(true, "host");

    this.navCtrl.setRoot(NowplayingPage);
  }

  goParty() {
    //create obj for passing key to next page
    var data = { hostKey: this.partyKey };
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
  */
}
