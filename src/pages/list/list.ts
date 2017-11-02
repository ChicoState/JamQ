import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { NowplayingPage } from '../nowplaying/nowplaying';
import { HomePage } from '../home/home';
// import { ListPage } from '../pages/list/list';
import { SearchPage } from '../search/search';
import { SlidesPage } from '../slides/slides';
import { ProfilePage } from '../profile/profile';



@Component({
  selector: "page-list",
  templateUrl: "list.html"
})
export class ListPage {
  songs: FirebaseListObservable<any>;
  owner: FirebaseObjectObservable<any>;
  host: any;
  selectedItem: any;
  icons: string[];
  items: Array<{ title: string; note: string; icon: string; id: number }>;
  key: any;
  partyKey: any;

  constructor(
    private afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase
  ) {
    //get key returned from join party page
    this.key = this.navParams.get("hostKey");
    //use key to access correct queue

    this.partyKey = sessionStorage["partyCookie"];
    //console.log(this.partyKey);
    this.songs = af.list("/" + this.partyKey + "/songlist");
    this.owner = af.object("/" + this.partyKey);
    this.owner.subscribe(snapshot => (this.host = snapshot.owner));

    // console.log(this.owner);

    //var firebaseKey = '/333/songlist'; //will get rid of this once its working
  }

  like(songid) {
     console.log("liked song");
  }

  dislike(songid) {
    console.log("disliked song");
  }
}
