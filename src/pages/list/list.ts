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
    this.key = this.navParams.get('hostKey');
    this.songs = af.list('/'+ this.key +'/songlist');

    // If we navigated to this page, we will have an item available as a nav param
    // this.selectedItem = navParams.get('item');

    // Let's populate this page with some filler content for funzies
    // this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    // 'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    for (let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Song ' + i,
        note: 'Artist ' + i,
        //icon: this.icons[Math.floor(Math.random() * this.icons.length)]
        icon: 'heart-outline',
        id: i
      });
    }
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    // this.navCtrl.push(ListPage, {
      // item: item
    // });
  }

//   toggle(id) {
//     if(this.items.find(x => x.id === id).icon == 'heart-outline') {
//         this.items.find(x => x.id === id).icon = 'heart'
//       } else this.items.find(x => x.id === id).icon = 'heart-outline'
//
// }


}
