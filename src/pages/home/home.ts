import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { ListPage } from '../list/list';
import { NowplayingPage } from '../nowplaying/nowplaying';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
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
  key: any;
  // hostKey: any;
  // data: { hostKey: any };


  constructor(public navCtrl: NavController,public platform: Platform,public af: AngularFireDatabase, public afAuth: AngularFireAuth) {
    if (platform.is('cordova')) { this.isMobile = true; }
    else { this.isMobile = false; }

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

  // getParty(ev: any) {
  //   this.key = ev.target.value.toString();
  //   console.log(this.key);
  // }

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
    var data = { hostKey: this.key }
    
    //make sure that the key exists in the DB
    //if key is not in DB display alert and then go to home page again
    //Then enter party

    //takes user to queue with data containing party key
    this.navCtrl.setRoot(ListPage, data);
  }
  //navigates to and sets root to host now playing page
  goParty() {
    // this.data.hostKey = document.getElementById('party').innerHTML
    //later we can check this and make sure that there is not already a party with that number
    //later we can check if the user is already hosting a party
    var randomServerNum = Math.floor(1000 + Math.random() * 9000); 
    var uniquePartyKey = randomServerNum.toString();
    sessionStorage["partyCookie"] = uniquePartyKey; 
    //console.log(hostKeyMessage);
    alert(uniquePartyKey);

    //create new table in db with corresponding key

    this.navCtrl.setRoot(NowplayingPage);
  }

}
