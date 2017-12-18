import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth'
import { ProfilePage } from "../profile/profile";
import { RegisterPage } from '../register/register';

/**
 * Generated class for the SlidesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-slides',
  templateUrl: 'slides.html',
})
export class SlidesPage {
  authenticated: any;

  constructor(
    private afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams) {

    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.navCtrl.setRoot(ProfilePage);
      }
    })

    //   var spotify = OAuth.create('spotify');
    //   if (spotify.access_token) {
    //     this.authenticated = true;
    //     this.navCtrl.setRoot(HomePage, {}, {animate: false});
    //   } else this.authenticated = false;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SlidesPage');
  }

  login() {
    this.navCtrl.push(RegisterPage, {}, { animate: false });

  }


}
