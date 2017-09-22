import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the NowplayingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nowplaying',
  templateUrl: 'nowplaying.html',
})
export class NowplayingPage {
items: Array<{title: string, note: string, icon: string,id: number}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad NowplayingPage');
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    // this.navCtrl.push(ListPage, {
      // item: item
    // });
  }

}
