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
    this.songs = af.list("/" + this.partyKey+ '/songlist', {
    query: {
    orderByChild: 'likes' ,
    limitToLast: 10
    }
  })

  }
  /*****
  This function only adds up to 20 likes
  *****/
  like(song) {
    var sb = this.songs;
    var index=0;
//alert("not shows " + song.likes + " " + index);
   for( index=0;index<20;index++){
     if(song.likes==index){
     this.songs.update(song.$key, {likes: index+1 });
        index=30;
      }
   }
    //alert("at end " + song.likes + " " + index);
  }
  dislike(songid) {
    for(var i=0;i<20;i++){
      if(songid.dislikes==i){
      this.songs.update(songid.$key, { dislikes: i+1 });
         i=30;
       }
    }

  }
}
