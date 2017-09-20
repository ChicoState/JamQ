import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NowplayingPage } from './nowplaying';

@NgModule({
  declarations: [
    NowplayingPage,
  ],
  imports: [
    IonicPageModule.forChild(NowplayingPage),
  ],
})
export class NowplayingPageModule {}
