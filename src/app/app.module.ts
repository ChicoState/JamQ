import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { ListPage } from '../pages/list/list';
import { SearchPage } from '../pages/search/search';
import { SlidesPage } from '../pages/slides/slides';
import { NowplayingPage } from '../pages/nowplaying/nowplaying';
import { Keyboard } from '@ionic-native/keyboard';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from './app.component';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ProfilePage } from '../pages/profile/profile';
import {DjProfilePage } from '../pages/djprofile/djprofile'

@NgModule({
  declarations: [
    MyApp,
    ListPage,
    SearchPage,
    NowplayingPage,
    SlidesPage,
    LoginPage,
    RegisterPage,
    ProfilePage,
    DjProfilePage
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    // HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SearchPage,
    ListPage,
    NowplayingPage,
    SlidesPage,
    LoginPage,
    RegisterPage,
    ProfilePage,
    DjProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
