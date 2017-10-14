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
  that: this;


  constructor(public platform: Platform, public navCtrl: NavController,
    public navParams: NavParams, public af: AngularFireDatabase) {
      //checks if device is mobile or Web
    if (platform.is('cordova')) { this.isMobile = true; }
      else { this.isMobile = false; }

      //gets the list at party id 111 for pushing songs there
      this.songs = af.list('/333/songlist');

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

  getItems(ev: any, that ) {

    for(var i = 0; i < 10; i++) {
      var artist = document.getElementById("artist" + i);
      var title = document.getElementById("title" + i);
      if( artist != null) {
        // artist.addEventListener("click", function(){ that.itemTapped(i) });
        console.log(artist.innerHTML + " " + title.innerHTML)
      }
    }

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
        .then(function(data, that) {
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
            var title = document.createElement('h2');
            title.innerHTML = song.items[i].name;
            title.setAttribute('id', "title" + i);
            // title.onclick =
            // title.addEventListener("click", function() { console.log(title.id); console.log(title.innerHTML) })

            var artist = document.createElement('p');
            artist.innerHTML = song.items[i].artists['0'].name;
            artist.setAttribute('id', "artist" + i);

            //img container for album cover
            var imgContainer = document.createElement('img');
            //set src attribute from api
            imgContainer.setAttribute('src', song.items[i].album.images[0].url);
            //sets unique id dynamically
            imgContainer.setAttribute('id', i.toString() );

            //create div for pushing elements to page
            var div = document.createElement('div');
            div.appendChild(imgContainer);
            div.appendChild(title);
            div.appendChild(artist);
            // div.setAttribute("class", "item item-block item-ios");
            //appends img to list
            // document.getElementById('list').appendChild(imgContainer);
            //appends album info to list under img
            document.getElementById('list').appendChild(div);
          }
        }, function(err) { //some error checking
          console.error(err);
        })

    }


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  itemTapped(index) {
    console.log(index);
    // console.log(document.getElementById("title" + index).innerHTML);
    // console.log(document.getElementById('artist' + index).innerHTML);
    // this.songs.push({songTitle: "Added Song", artist: "Added Artist" });
    // return document.getElementById("title" + index);
  }

}
