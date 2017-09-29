import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { ListPage } from '../list/list';
import { NowplayingPage } from '../nowplaying/nowplaying';
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

  constructor(public navCtrl: NavController,public platform: Platform) {
    if (platform.is('cordova')) { this.isMobile = true; }
    else { this.isMobile = false; }
  }

  mobileAuth(){
    //initializes spotify auth
    OAuth.initialize('NJG7cpjPQHkVhSQgvpQi5MRoyM4');
    //popup for spotify login
    //then resets html to wait for auth to complete
      //idealy this would be a loading feature to wait until popup closes with success
    //on error sends alert  to page for debbuging
      OAuth.popup('spotify',{cache: true}).done(function(spotify) {

      }).then( this.goHost()
      ).fail(function(err) {
        alert("Error with spotify login");
      });
  }

  webAuth() {
    OAuthWeb.initialize('NJG7cpjPQHkVhSQgvpQi5MRoyM4');
      //popup for spotify login
      //then resets html to wait for auth to complete
        //idealy this would be a loading feature to wait until popup closes with success
      //on error sends alert  to page for debbuging
        OAuthWeb.popup('spotify',{cache: true}).done(function(spotify) {
        }).then( this.goHost()
        ).fail(function(err) {
          alert("Error with spotify login");
        });

  }

  checkAuth(){
    // Pulls the spotify auth if cached and checks if currently Authenticated
    var spotify = OAuth.create('spotify');
    console.log("checking");
    if(spotify.access_token) {
      this.authenticated = true;
    }
  }

  hostParty() {
    if (this.isMobile == true) {
        //is phone
      this.mobileAuth();
    } else {
      //is web
      this.webAuth();
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
    this.navCtrl.setRoot(ListPage);
  }
  //navigates to and sets root to host now playing page
  goParty() {
    this.navCtrl.setRoot(NowplayingPage);
  }

}
