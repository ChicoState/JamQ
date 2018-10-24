import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NowplayingPage } from '../pages/nowplaying/nowplaying';
import { ListPage } from '../pages/list/list';
import { SearchPage } from '../pages/search/search';
import { SlidesPage } from '../pages/slides/slides';
import { ProfilePage } from '../pages/profile/profile';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = SlidesPage;

  userpages: Array<{title: string, component: any}>;
  hostpages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();


    // used for an example of ngFor and navigation
    this.userpages = [
      //{ title: 'JamQ Home', component: HomePage },
      { title: 'Queue', component: ListPage },
      { title: 'Search', component: SearchPage },
      { title: 'Profile', component: ProfilePage }
    ];
    this.hostpages = [
      //{ title: 'JamQ Home', component: HomePage },
      { title: 'Host', component: NowplayingPage },
      { title: 'Search', component: SearchPage },
      { title: 'Profile', component: ProfilePage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }
}

export const firebaseConfig = {
    apiKey: "AIzaSyCp9HMB336Zfcrl5spkAy4-w1nsrOe5wU0",
    authDomain: "jamq-b015a.firebaseapp.com",
    databaseURL: "https://jamq-b015a.firebaseio.com",
    projectId: "jamq-b015a",
    storageBucket: "jamq-b015a.appspot.com",
    messagingSenderId: "45757196990"
  };
