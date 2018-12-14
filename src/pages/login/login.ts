import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireDatabase } from 'angularfire2/database';
import { PartyPage } from "../party/party";
import { RegisterPage } from "../register/register";

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
    public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public afDatabase: AngularFireDatabase) {

    if (platform.is('cordova')) { this.isMobile = true; }
    else { this.isMobile = false; }


    // If we are loggin in ensure we a logged out first
    this.logout();


    //Listen for changes to authentication
    this.afAuth.auth.onAuthStateChanged(function (user) {
      if (user) {

        console.log(user);
        // User is signed in.
        var isAnonymous = user.isAnonymous;

        if (isAnonymous) {
          var uid = user.uid;

          afDatabase.database.ref('users/' + uid).set({
            username: "Guest"
          })
        }

      }
      // ...
      else {
        // User is signed out.
        // ...
      }
      // ...
    });



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async login(user: User) {
    var errorMessage = ""
    this.afAuth.auth.signInWithEmailAndPassword(user.email,user.password).catch(function(error) {
      errorMessage = error.message;
      console.log(errorMessage);
      alert(errorMessage);
    }).then(function(){
      if(errorMessage.length == 0){
        this.navCtrl.setRoot(PartyPage);
      }
    }.bind(this))
  }

  show() {
    document.getElementById("login").style.visibility = "hidden";
    document.getElementById("hide").style.visibility = "visible";
  }

  register() { this.navCtrl.push(RegisterPage, {}, { animate: false }) }

  goHome() { this.navCtrl.setRoot(PartyPage) }

  guest() {
    this.afAuth.auth.signInAnonymously().catch(function (error) {
      console.log(error);
    });
    this.navCtrl.setRoot(PartyPage)
  }

  //If we are at the sign on page we had better be logged out
  logout() {
    //this.afAuth.auth.signOut();
    this.afAuth.auth.signOut().then(function () {
      // Sign-out successful
    }, function (error) {
      // An error happened.
      alert("// An error happened.");
    });
  }
}



