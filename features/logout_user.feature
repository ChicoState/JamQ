guest() {
    this.afAuth.auth.signInAnonymously().catch(function (error) {
      console.log(error);
    });
    this.navCtrl.setRoot(PartyPage)
  }
