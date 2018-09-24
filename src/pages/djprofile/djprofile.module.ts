import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DjProfilePage } from './djprofile';

@NgModule({
  declarations: [
    DjProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(DjProfilePage),
  ],
})
export class ProfilePageModule {}
