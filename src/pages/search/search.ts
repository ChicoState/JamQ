import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { OAuth as OAuthWeb } from 'oauthio-web';
import { OAuth } from 'oauth-phonegap';
import { Platform } from 'ionic-angular';


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

  constructor(public navCtrl: NavController, public navParams: NavParams,private keyboard: Keyboard) {
      //getting spotify api library
      var SpotifyWebApi = require('spotify-web-api-node');
      //build api with no params
      this.spotifyApi = new SpotifyWebApi();

    var platform = new Platform;
    if (platform.is('ios') || platform.is('android') || platform.is('windows')) {
      //is phone
      //gets auth from cache named 'spotify'
      var spotify = OAuth.create('spotify');
    } else {
      //is web
      //gets auth from cache named 'spotify'
      var spotify = OAuthWeb.create('spotify');
    }
      //sets access token of authenticated user
      this.spotifyApi.setAccessToken(spotify.access_token);
  }

  getItems(ev: any) {
    // this.showKeyboard();
    var mydiv = document.getElementById('list');
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

          for(var i = 0; i < 10; i++)
          {
            i.toString();
            var html = '<ion-item clear ion-item (click)="itemTapped($event, item)">' +
            '<ion-thumbnail item-start>' +
            '<img id="img" src="' + song.items[i].album.images['0'].url + '">' +
            '</ion-thumbnail>' +
            '<h2 id="title">' + song.items[i].name + ' </h2>' +
            '<p id="artist"> ' + song.items[i].artists['0'].name +
            ' </p>' +
            '<button ion-button clear item-end>' +
            '<ion-icon name="add"> </ion-icon>' +
            '</button>' +
            '</ion-item>';

            var div = document.createElement('ion-item');
            // div.setAttribute('class', 'post block bc2');
            div.insertAdjacentHTML('beforeend', html);
            document.getElementById('list').appendChild(div);

          }

          // document.getElementById('songObj').innerHTML = html;
          // for(var i = 0; i < 10; i++) {
          // // pushing elements to page
          // (<HTMLImageElement>document.getElementById("img" + i)).src = song.items[i].album.images['0'].url;
          // document.getElementById("title"+i).innerHTML = song.items[i].name;
          // document.getElementById("artist"+i).innerHTML = song.items[i].artists['0'].name;
          //
          // }



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

  showKeyboard() {
    // this.keyboard.show();
  }

}
