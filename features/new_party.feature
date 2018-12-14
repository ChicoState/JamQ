newParty() { 
    //later we can check this and make sure that there is not already a party with that number 
    //later we can check if the user is already hosting a party
    var randomServerNum = Math.floor(10000 + Math.random() * 90000);
    this.partyKey = randomServerNum.toString();

    sessionStorage["partyCookie"] = this.partyKey; 
    sessionStorage["role"] = "host"; //maybe later have it check if its your party or not

    //create the db observable to manipulate
    this.party = this.af.object("/parties/" + this.partyKey);
    let db = this.party;
    console.log("user name in newpart is: ")
    console.log(this.user.username);

    if (this.spotifyApi._credentials != null && this.spotifyApi._credentials.accessToken != undefined) {

      let token = this.spotifyApi._credentials.accessToken;

      this.afAuth.authState.subscribe(data => {
        db.set({ 
          owner: this.user.username,
          owenerid: data.uid,
          spotifytoken: token
        });
      
      });

    } else {
      this.afAuth.authState.subscribe(data => {
        db.set({ 
          owner: this.user.username,
          owenerid: data.uid
        });

      });
    }

    //create new table in db with corresponding key

    this.alertCtrl.create({ title: "Your party number is " + this.partyKey }).present();

    //eable host menu/disable user
    this.menuCtrl.enable(false, "user");
    this.menuCtrl.enable(true, "host");
    this.navCtrl.setRoot(NowplayingPage);
  }

