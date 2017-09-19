import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ListPage } from '../list/list';
import { HomePage } from '../home/home';
import { OAuth } from 'oauthio-web';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    OAuth.initialize('NJG7cpjPQHkVhSQgvpQi5MRoyM4')
    OAuth.popup('spotify').done(function(result) {
    console.log(result)
    // do some stuff with result
})
    this.navCtrl.push(HomePage);
  }

}
