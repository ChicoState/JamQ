import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase} from 'angularfire2/database';
import 'rxjs/add/operator/take';
import {PartyPage } from '../party/party';
import { DjregisterPage } from '../djregister/djregister';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  user = {} as User;

  constructor(
    private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  async register(user: User,) {
    if(user.password != user.verify) {
      alert("Passwords don't match")
    } else {
      try {
        const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email,user.password);
        console.log(result);
        if(result) {
          this.afAuth.authState.take(1).subscribe(auth => {
            this.afDatabase.list(`users/${auth.uid}`).set("username", this.user.username);
          })
        }
      } catch (error) {
        alert(error)
        // console.log(error)
      }
      this.navCtrl.setRoot(PartyPage)
    }

  }

  existinglogin() {
    this.navCtrl.push(LoginPage, {}, { animate: false });

  }

  djregister() {
    this.navCtrl.push(DjregisterPage, {}, { animate: false });

  }

}
