import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import {
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable
} from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import "rxjs/add/operator/map";

@Component({
  selector: "page-list",
  templateUrl: "list.html"
})
export class ListPage {
  songs: FirebaseListObservable<any>;
  owner: FirebaseObjectObservable<any>;
  user_likes: FirebaseListObservable<any>;
  user_dislikes: FirebaseListObservable<any>;
  likeCheck: FirebaseListObservable<any>;
  dislikeCheck: FirebaseListObservable<any>;
  dislikeCount: FirebaseObjectObservable<any>;
  host: any;
  selectedItem: any;
  icons: string[];
  items: Array<{ title: string; note: string; icon: string; id: number }>;
  key: any;
  partyKey: any;
  username: any;

  constructor(
    private afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase
  ) {
    //use key to access correct queue
    this.partyKey = sessionStorage["partyCookie"];

    this.afAuth.authState.subscribe(auth => {
      this.af.object(`users/${auth.uid}`).take(1).subscribe(data => {
        this.username = data.username;
        this.user_likes = af.list("/" + this.partyKey + "/userlist/" + data.username + "/likes");
        this.user_dislikes = af.list("/" + this.partyKey + "/userlist/" + data.username + "/dislikes");
      });
    });


    //get key returned from join party page
    //this.key = this.navParams.get("hostKey");
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

  like(song) {
    var temp = [];
    this.likeCheck = this.af.list("/" + this.partyKey + "/userlist/" + this.username + "/likes");
    this.likeCheck.subscribe(data => {
      data.forEach(item => {
        // console.log(item.song)
        temp.push(item.song)
      })

    })
    //console.log(temp)
    var check = false;
    if (temp.length == 0) {
      this.user_likes.push({ song: song.$key });
      this.songs.update(song.$key, { likes: song.likes + 1 });
      check = true;
    } else {
      for (var i = 0; i < temp.length; i++) {
        console.log("checking songs")
        if (temp[i] == song.$key) {
          check = true;
          break;
        }
      }
    }


    if (check == false) {
      this.user_likes.push({ song: song.$key });
      this.songs.update(song.$key, { likes: song.likes + 1 });
    }
  }
  dislike(song) {
    var temp = [];
    this.dislikeCheck = this.af.list("/" + this.partyKey + "/userlist/" + this.username + "/dislikes");
    this.dislikeCheck.subscribe(data => {
      data.forEach(item => {
        // console.log(item.song)
        temp.push(item.song)
      })

    })
    //console.log(temp)
    var check = false;
    if (temp.length == 0) {
      this.user_dislikes.push({ song: song.$key });
      this.songs.update(song.$key, { likes: song.likes - 1 });
      check = true;
    } else {
      for (var i = 0; i < temp.length; i++) {
        console.log("checking songs")
        if (temp[i] == song.$key) {
          check = true;
          break;
        }
      }
    }

    if (check == false) {
      this.user_dislikes.push({ song: song.$key });
      this.songs.update(song.$key, { likes: song.likes - 1 });
    }
  }
}
