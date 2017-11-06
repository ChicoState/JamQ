import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { OAuth } from 'oauth-phonegap';
import { OAuth as OAuthWeb } from 'oauthio-web';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth'

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
  isMobile: any;
  user = {} as User;

  constructor(
    private afAuth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams, public platform: Platform) {

    if (platform.is('cordova')) { this.isMobile = true; }
    else { this.isMobile = false; }
  }
  // //use for authentiating with mobile libraries
  // mobileAuth(){
  //   //initializes spotify auth
  //   OAuth.initialize('NJG7cpjPQHkVhSQgvpQi5MRoyM4');
  //   //popup for spotify login
  //   //then resets html to wait for auth to complete
  //     //idealy this would be a loading feature to wait until popup closes with success
  //   //on error sends alert  to page for debbuging
  //     OAuth.popup('spotify',{cache: true}).done(function(spotify) {
  //
  //     }).then( this.show()
  //     ).fail(function(err) {
  //       alert("Error with spotify login");
  //     });
  // }
  //
  // //use for authenticating with web libraries
  // webAuth() {
  //   var spotify = OAuthWeb.create('spotify');
  //   if(spotify.access_token){
  //     // console.log(spotify.access_token);
  //     this.show();
  //
  //   } else {
  //   OAuthWeb.initialize('NJG7cpjPQHkVhSQgvpQi5MRoyM4');
  //     //popup for spotify login
  //     //then resets html to wait for auth to complete
  //       //idealy this would be a loading feature to wait until popup closes with success
  //     //on error sends alert  to page for debbuging
  //       OAuthWeb.popup('spotify',{cache: true}).done(function(spotify) {
  //       }).then( this.show()
  //       ).fail(function(err) {
  //         alert("Error with spotify login");
  //       });
  //     }
  //
  // }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  register() {
    this.navCtrl.setRoot(RegisterPage)
  }

  async login(user: User) {
    try {
      const res = this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      // console.log(res);
      this.navCtrl.setRoot(HomePage);
    } catch (error) {
      alert(error)
      console.log(error)
    }

    // if (this.isMobile == true) {
    //     //is phone
    //     this.mobileAuth();
    //   } else {
    //     //is web
    //     this.webAuth();
    //   }
  }

  show() {
      document.getElementById("login").style.visibility = "hidden";
      document.getElementById("hide").style.visibility = "visible";
  }

  goHome() { this.navCtrl.setRoot(HomePage) }

}
