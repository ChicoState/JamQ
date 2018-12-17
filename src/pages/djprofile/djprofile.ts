import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from "angularfire2/database";
import { FirebaseObjectObservable } from 'angularfire2/database';
import { DjUser } from '../../models/djuser';
import { User } from '../../models/user';


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
  user = {} as DjUser;
  // user_location: FirebaseListObservable<any>;
  // user_genre: FirebaseListObservable<any>;
  // user_first: FirebaseListObservable<any>;
  // user_last: FirebaseListObservable<any>;


  constructor(
    private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase,
    public navCtrl: NavController, public navParams: NavParams) {
      this.afAuth.auth.onAuthStateChanged((user) => {
        if (user) {
          var user_ = this.user;
          this.afDatabase.database.ref('users/' + user.uid + '/username').once('value').then(function (snapshot) {
            user_.username = snapshot.val();
          })
          this.afDatabase.database.ref('users/' + user.uid + '/firstname').once('value').then(function (snapshot) {
            user_.firstname = snapshot.val();
          })
          this.afDatabase.database.ref('users/' + user.uid + '/lastname').once('value').then(function (snapshot) {
            user_.lastname = snapshot.val();
          })
          this.afDatabase.database.ref('users/' + user.uid + '/location').once('value').then(function (snapshot) {
            user_.location = snapshot.val();
          })
          this.afDatabase.database.ref('users/' + user.uid + '/genre').once('value').then(function (snapshot) {
            user_.genre = snapshot.val();
            console.log(user_);
          })
        }
      }
      );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DjprofilePage');
  }
}
