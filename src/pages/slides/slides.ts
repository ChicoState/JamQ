import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { OAuth } from 'oauthio-web';
import { HomePage } from '../home/home';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    var spotify = OAuth.create('spotify');
    if (spotify.access_token) {
      this.authenticated = true;
      this.navCtrl.setRoot(HomePage, {}, {animate: false});
    } else this.authenticated = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SlidesPage');
  }

  login(){
  // Your app login API web service call triggers
  this.navCtrl.push(LoginPage, {}, {animate: false});

}


}
