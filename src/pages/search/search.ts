import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OAuth } from 'oauthio-web';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
        //getting spotify api library
    var SpotifyWebApi = require('spotify-web-api-node');
    //build api with no params
    this.spotifyApi = new SpotifyWebApi();
    //gets auth from cache named 'spotify'
    var spotify = OAuth.create('spotify');
    //sets access token of authenticated user
    this.spotifyApi.setAccessToken(spotify.access_token);


  }

  getItems(ev: any) {

    // set val to the value of the searchbar
    let queryTerm = ev.target.value;
    // if the value is an empty string don't filter the items
    if (queryTerm && queryTerm.trim() != '') {
    //search track titles and return top 10 results
    var prev = this.spotifyApi.searchTracks(queryTerm, {limit: 10})
        .then(function(data) {
          //song object for easier calls
          let song = data.body.tracks.items['0'];

          // clean the promise so it doesn't call abort
          prev = null;

          //pushing elements to page
          (<HTMLImageElement>document.getElementById("img")).src = song.album.images['0'].url;
          document.getElementById("title").innerHTML = song.name;
          document.getElementById("artist").innerHTML = song.artists['0'].name;


        }, function(err) { //some error checking
          console.error(err);
        });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }
  
  itemTapped(event, item) {
  }

}
