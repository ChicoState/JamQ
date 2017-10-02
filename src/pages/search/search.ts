import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { OAuth as OAuthWeb } from 'oauthio-web';
import { OAuth } from 'oauth-phonegap';
import { Platform } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';



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
  key: any;
  isMobile: any;


  constructor(public platform: Platform, public navCtrl: NavController, public   navParams: NavParams,private keyboard: Keyboard, public af: AngularFireDatabase) {
      //checks if device is mobile or Web
    if (platform.is('cordova')) { this.isMobile = true; }
      else { this.isMobile = false; }

      //gets the list at party id 111 for pushing songs there
      this.songs = af.list('/111/songlist');

      //getting spotify api library
      var SpotifyWebApi = require('spotify-web-api-node');
      //build api with no params
      this.spotifyApi = new SpotifyWebApi();

      //switches Auth method based on if mobile or web
      if (this.isMobile) {
        //is phone
        //gets auth from cache named 'spotify'
        var spotify = OAuth.create('spotify');
      } else {
        //is web
        //gets auth from cache named 'spotify'
        var spotify = OAuthWeb.create('spotify');
        console.log("is Web");
      }
      //sets access token of authenticated user
      this.spotifyApi.setAccessToken(spotify.access_token);
  }

  getItems(ev: any) {
    //gets the list that displays songs
    var mydiv = document.getElementById('list');
    //while loop that removes list of current songs displayed
    while(mydiv.firstChild) {
    mydiv.removeChild(mydiv.firstChild);
    }

    // set val to the value of the searchbar
    let queryTerm = ev.target.value;
    // if the value is an empty string don't filter the items
    if (queryTerm && queryTerm.trim() != '') {
    //search track titles and return top 10 results
    var prev = this.spotifyApi.searchTracks(queryTerm, {limit: 10})
        .then(function(data) {
          //song object for easier calls
          let song = data.body.tracks;
          // clean the promise so it doesn't call abort
          prev = null;

          //for loop that iterates through the 10 songs returned from api
          //sends html for each one to page
          for(var i = 0; i < 10; i++)
          {
            //checks if element exists
            if(!song.items[i]) {
               continue;
            }

            i.toString();
            //html sting to push to page
            var html =
            //h2 element for Song title
            '<h2 id="title" (click)="itemTapped(' + song.items[i].name + ')">' + song.items[i].name + ' </h2>' +
            //p element for Artist name
            '<p id="artist"> ' + song.items[i].artists['0'].name +' </p>';

            //img container for album cover
            var imgContainer = document.createElement('img');
            //set src attribute from api
            imgContainer.setAttribute('src', song.items[i].album.images[0].url);
            //sets unique id dynamically
            imgContainer.setAttribute('id', i.toString() );

            //create div for pushing elements to page
            var div = document.createElement('div');
            //adds html from above to the div
            div.insertAdjacentHTML('beforeend', html);
            //appends img to list
            document.getElementById('list').appendChild(imgContainer);
            //appends album info to list under img
            document.getElementById('list').appendChild(div);
          }
        }, function(err) { //some error checking
          console.error(err);
        });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  itemTapped() {
    // console.log("yo");
    this.songs.push({songTitle: "Added Song", artist: "Added Artist" });
  }

}
