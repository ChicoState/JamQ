import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  songs: FirebaseListObservable<any>;
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string,id: number}>;
  key: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public af: AngularFireDatabase) {
    //get key returned from join party page
    this.key = this.navParams.get('hostKey');
    //use key to access correct queue
    var partyKey = sessionStorage['partyCookie'];
    console.log(partyKey);
    var str = "/"; 
    partyKey = str.concat(partyKey);
    console.log(partyKey);
    str = "/songlist";
    partyKey = partyKey.concat(str);
    console.log(partyKey);
    //var firebaseKey = partyKey;
    var firebaseKey = '/333/songlist'; //will get rid of this once its working
    
    this.songs = af.list(firebaseKey);
  }

}
