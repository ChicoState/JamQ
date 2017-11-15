import { Component } from '@angular/core';
import { NavController, Events, ToastController, MenuController } from 'ionic-angular';
import { ListPage } from '../list/list';
import { NowplayingPage } from '../nowplaying/nowplaying';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../models/user';
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
  partyKey: any;
  party: FirebaseObjectObservable<any>;
  userJoin: FirebaseListObservable<any>;
  userHost: FirebaseListObservable<any>;
  user = {} as User;

  constructor(
    private toast: ToastController, private afDatabase: AngularFireDatabase,
    public menuCtrl: MenuController,
    public navCtrl: NavController, public platform: Platform,
    public af: AngularFireDatabase, public afAuth: AngularFireAuth
  ) {
    if (platform.is('cordova')) { this.isMobile = true; }
    else { this.isMobile = false; }
    if (sessionStorage["partyCookie"] > 0) {
      this.partyKey = sessionStorage['partyCookie'];
    }
  }

  //navigates to and sets root Queue
  goQueue() {
    // this.partyKey = document.getElementById('party').innerHTML
    //create obj for passing key to next page
    var data = { hostKey: this.partyKey }
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
    this.menuCtrl.enable(true, 'user');
    this.menuCtrl.enable(false, 'host');
    this.userJoin.push({party:this.partyKey});


    //takes user to queue with data containing party key
    this.navCtrl.setRoot(ListPage,data);
    //this.navCtrl.setRoot(NowplayingPage);
  }
  //navigates to and sets root to host now playing page
  newParty() {
    //later we can check this and make sure that there is not already a party with that number
    //later we can check if the user is already hosting a party
    var randomServerNum = Math.floor(1000 + Math.random() * 9000);
    this.partyKey= randomServerNum.toString();

    sessionStorage["partyCookie"] = this.partyKey;
    sessionStorage["role"] = "host"; //maybe later have it check if its your party or not

    //create the db observable to manipulate
    this.party = this.af.object("/" + this.partyKey);
    let db = this.party;
    this.afAuth.authState.subscribe(data => {
      this.afDatabase.object(`users/${data.uid}`).take(1).subscribe(user => {
        db.set({
          owner: user.username
        })
      });
    })

    this.userHost.push({party:this.partyKey});

    //create new table in db with corresponding key

    //eable host menu/disable user
    this.menuCtrl.enable(false, 'user');
    this.menuCtrl.enable(true, 'host');




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
    this.menuCtrl.enable(false, 'user');
    this.menuCtrl.enable(true, 'host');

  }

  ionViewDidLoad() {
    this.afAuth.authState.subscribe(data => {
      this.userHost = this.afDatabase.list(`users/${data.uid}/hosted`);
      this.userJoin = this.afDatabase.list(`users/${data.uid}/joined`);

      this.toast.create({
        message: 'Welcome to JamQ ',
        duration: 1000,
        position: 'top',
        cssClass: 'page-home'
      }).present();
    });

    if (sessionStorage["partyCookie"]>0) {
      document.getElementById("goto").style.visibility =  "visible";
    }
    console.log('ionViewDidLoad NowplayingPage');
  }

}
