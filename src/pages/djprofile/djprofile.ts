import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { FirebaseObjectObservable } from 'angularfire2/database';

/**
 * Generated class for the DjprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-djprofile',
  templateUrl: 'djprofile.html',
})
export class DjprofilePage {
  // user_location: FirebaseListObservable<any>;
  // user_genre: FirebaseListObservable<any>;
  // user_first: FirebaseListObservable<any>;
  // user_last: FirebaseListObservable<any>;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DjprofilePage');
  }

}
