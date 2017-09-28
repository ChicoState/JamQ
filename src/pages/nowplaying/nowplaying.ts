import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OAuth } from 'oauthio-web';
import { SpotifyWebApi } from 'spotify-web-api-node';
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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    //getting spotify api library
    var SpotifyWebApi = require('spotify-web-api-node');
    //build api with no params
    var spotifyApi = new SpotifyWebApi();
    //gets auth from cache named 'spotify'
    var spotify = OAuth.create('spotify');
    //sets access token of authenticated user
    spotifyApi.setAccessToken(spotify.access_token);
    //gets user data from api and asynchronously throws it into page
      //checks if user has display name if not uses user id
      spotifyApi.getMe().then(function(data) {
        if (data.body.display_name){
          document.getElementById("name").innerHTML = data.body.display_name + "'s party";
        } else {
          document.getElementById("name").innerHTML = data.body.id + "'s party";
        }
      }, function(err) { //error checking
        console.log('Something went wrong!', err);
      })

      //builds aray of items to be listed on page
    this.items = [];
    for (let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Song ' + i,
        note: 'Artist ' + i,
        //icon: this.icons[Math.floor(Math.random() * this.icons.length)]
        icon: 'heart-outline',
        id: i
      });
    }

  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad NowplayingPage');
  }

  itemTapped(event, item) {
  }

}
