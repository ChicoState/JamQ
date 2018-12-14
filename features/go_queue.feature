 goQueue() {
    // this.partyKey = document.getElementById('party').innerHTML
    //create obj for passing key to next page
    let prompt = this.alertCtrl.create({
      title: 'Enter the party # you want to join',
      //message: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Party Number'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            //Do nothing just go back to the profile page
          }
        },
        {
          text: 'Join',
          handler: data => {
            console.log(data.title);
            var uniquePartyKey = parseInt(data.title);
            //console.log(uniquePartyKey);
            if (isNaN(uniquePartyKey)) {
              alert("Please enter a party number");
              return;
            } else if (uniquePartyKey < 10000 || uniquePartyKey > 99999) {
              // later we should check if the party already exists in the db
              alert("Party number does not exist"); // later we should check if the party already exists in the db
              return;
            }

            sessionStorage["partyCookie"] = data.title;
            sessionStorage["role"] = "guest";
            //maybe later have it check if its your party or not

            //Will need to push joined party to user in DB

            //remove user menu options
            this.menuCtrl.enable(true, "user");
            this.menuCtrl.enable(false, "host");

            //takes user to queue with data containing party key
            this.navCtrl.setRoot(NowplayingPage);
          }
        }
      ]
    });
    prompt.present();
  }

