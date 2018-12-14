async login(user: User) {
    var errorMessage = ""
    this.afAuth.auth.signInWithEmailAndPassword(user.email,user.password).catch(function(error) {
      errorMessage = error.message;
      console.log(errorMessage);
      alert(errorMessage);
    }).then(function(){
      if(errorMessage.length == 0){
        this.navCtrl.setRoot(PartyPage);
      }
    }.bind(this))
  }

