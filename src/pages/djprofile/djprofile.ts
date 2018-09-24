import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { MenuController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { OAuth as OAuthWeb } from "oauthio-web";
import { OAuth } from "oauth-phonegap";
import { Platform } from "ionic-angular";
import {
  AngularFireDatabase,
} from "angularfire2/database";
import { FirebaseObjectObservable } from 'angularfire2/database';
import { User } from '../../models/user';
import { SlidesPage } from '../slides/slides';
import { ListPage } from '../list/list';
import { NowplayingPage } from '../nowplaying/nowplaying';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';
import {FirebaseListObservable } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "djprofile.html"
})
export class DjProfilePage {


  constructor(

    
  ) {
    //Do constructor stuff
  }

}
