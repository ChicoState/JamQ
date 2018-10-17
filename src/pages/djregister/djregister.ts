

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DjUser } from '../../models/djuser';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase} from 'angularfire2/database';
import 'rxjs/add/operator/take';
import { LoginPage } from '../login/login';
import {PartyPage } from '../party/party';

@IonicPage()
@Component({
  selector: 'page-djregister',
  templateUrl: 'djregister.html',
})
export class DjregisterPage {
  djuser = {} as DjUser;

  constructor(
    private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  async register(djuser: DjUser,) {
    if(djuser.password != djuser.verify) {
      alert("Passwords don't match")
    } else {
      try {
        const result = await this.afAuth.auth.createUserWithEmailAndPassword(djuser.email,djuser.password);
        console.log(result);
        if(result) {
          this.afAuth.authState.take(1).subscribe(auth => {
            this.afDatabase.list(`users/${auth.uid}`).set("username", this.djuser.username);
            this.afDatabase.list(`users/${auth.uid}`).set("firstname", this.djuser.firstname);
            this.afDatabase.list(`users/${auth.uid}`).set("lastname", this.djuser.lastname);
          })
        }
      } catch (error) {
        alert(error)
        // console.log(error)
      }
      this.navCtrl.setRoot(PartyPage);
    }

  }

  existinglogin() {
    this.navCtrl.setRoot(LoginPage);

  }

}
