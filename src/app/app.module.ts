import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { SearchPage } from '../pages/search/search';
import { SlidesPage } from '../pages/slides/slides';
import { NowplayingPage } from '../pages/nowplaying/nowplaying';

// import { Http } from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
// import { HTTP_INTERCEPTORS } from '@angular/common/http';


// import { RemoteService } from '../providers/remote-service';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RemoteServiceProvider } from '../providers/remote-service/remote-service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    SearchPage,
    NowplayingPage,
    SlidesPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SearchPage,
    ListPage,
    NowplayingPage,
    SlidesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    RemoteServiceProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RemoteServiceProvider
  ]
})
export class AppModule {}
