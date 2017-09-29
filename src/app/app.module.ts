import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { SearchPage } from '../pages/search/search';
import { SlidesPage } from '../pages/slides/slides';
import { NowplayingPage } from '../pages/nowplaying/nowplaying';
import { Keyboard } from '@ionic-native/keyboard';


// import { Http } from '@angular/http';
// import {HttpClientModule} from '@angular/common/http';
// import { HTTP_INTERCEPTORS } from '@angular/common/http';


// import { RemoteService } from '../providers/remote-service';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    SearchPage,
    NowplayingPage,
    SlidesPage
  ],
  imports: [
    BrowserModule,
    // HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SearchPage,
    ListPage,
    NowplayingPage,
    SlidesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
