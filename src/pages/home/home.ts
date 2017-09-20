import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ListPage } from '../list/list';
import { NowplayingPage } from '../nowplaying/nowplaying';
import { OAuth } from 'oauthio-web';
// import { , Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {HttpEvent, HttpHeaders, HttpInterceptor, HttpHandler, HttpRequest, HttpParams } from '@angular/common/http';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  name: any;
  // response: Observable<any>;
  // test: any;
  user$: Observable<any>;

  constructor(public navCtrl: NavController, public http: HttpClient) {

      var spotify = OAuth.create('spotify');
      spotify.me().done(function(data) {
          this.name = data.name;
      });
      // console.log(spotify.access_token);
}

  hostParty() {
    this.navCtrl.setRoot(NowplayingPage);
  }
  
  goQueue() {
    this.navCtrl.setRoot(ListPage);
  }

}
