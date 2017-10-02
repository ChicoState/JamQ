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
    if (platform.is('cordova')) { this.isMobile = true; }
      else { this.isMobile = false; }

      this.key = this.navParams.get('hostKey');

      this.songs = af.list('/111/songlist');

      //getting spotify api library
      var SpotifyWebApi = require('spotify-web-api-node');
      //build api with no params
      this.spotifyApi = new SpotifyWebApi();

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
            if(!song.items[i]) {
               continue;
            }

            // let item = document.createElement('ion-item');
            i.toString();
            var html = //'<ion-item clear ion-item (click)="itemTapped($event, item)">' +
            //'<ion-thumbnail item-start>' +
            // '<img id="img" src="' + song.items[i].album.images['0'].url + '">' +
            //'</ion-thumbnail>' +
            '<h2 id="title" (click)="itemTapped(' + song.items[i].name + ')">' + song.items[i].name + ' </h2>' +
            '<p id="artist"> ' + song.items[i].artists['0'].name +
            ' </p>' +
            //'<button ion-button clear item-end>' +
            //'<ion-icon name="add"> </ion-icon>' +
            //'</button>' +
            //'</ion-item>';
            '';

            // var ionItem = document.createElement('ion-item clear ion-item')

            var imgContainer = document.createElement('img');
            imgContainer.setAttribute('src', song.items[i].album.images[0].url);
            imgContainer.setAttribute('id', i.toString() );

            // imgContainer.setAttribute("onclick", "itemTapped(" + song.items[i].name + ")");
            // imgContainer.setAttribute("onclick", "itemTapped('song')");

            // var ionThumbnail = document.createElement('ion-thumbnail item-start').appendChild(imgContainer)

            // ionItem.appendChild(ionThumbnail);


            // document.getElementById('img').appendChild(imgContainer);

            var div = document.createElement('div');
            // div.setAttribute('class', 'post block bc2');
            div.insertAdjacentHTML('beforeend', html);
            document.getElementById('list').appendChild(imgContainer);
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

  itemTapped() {
    // let title = document.getElementById('title').innerHTML
    console.log("yo");
    this.songs.push({songTitle: "Added Song", artist: "Added Artist" });
  }

  showKeyboard() {
    // this.keyboard.show();
  }

}
