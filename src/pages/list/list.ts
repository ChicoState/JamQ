import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import {
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable
} from "angularfire2/database";
import { AngularFireModule } from "angularfire2";
import { AngularFireAuth } from "angularfire2/auth";
import { NowplayingPage } from "../nowplaying/nowplaying";
import { HomePage } from "../home/home";
// import { ListPage } from '../pages/list/list';
import { SearchPage } from "../search/search";
import { SlidesPage } from "../slides/slides";
import { ProfilePage } from "../profile/profile";
import "rxjs/add/operator/map";

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
    this.songs = af.list("/" + this.partyKey + "/songlist", {
      //toString(parseInt('likes') - parseInt('dislikes'))
      query: {
        //orderByChild: toString( (parseInt('likes') - parseInt('dislikes'))  ,
        orderByChild: "likes",
        limitToLast: 10
      }
    });
  }
  /*****
  This function only adds up to 20 likes
  *****/
  like(song) {
    this.songs.update(song.$key, { likes: song.likes + 1 });
    //sleep(5);
  }
  dislike(song) {
    this.songs.update(song.$key, { likes: song.likes - 1 });
    //sleep(5);
  }
}

function sleep(seconds) {
  var e = new Date().getTime() + seconds * 1000;
  while (new Date().getTime() <= e) {}
}
