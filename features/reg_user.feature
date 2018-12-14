async register(user: User,) {
    if(user.password != user.verify) {
      alert("Passwords don't match")
    } else {
      try {
        const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email,user.password);
        console.log(result);
        if(result) {
          this.afAuth.authState.take(1).subscribe(auth => {
            this.afDatabase.list(`users/${auth.uid}`).set("username", this.user.username);
          })
        }
      } catch (error) {
        alert(error)
        // console.log(error)
  return;
      }
      this.navCtrl.setRoot(PartyPage)
    }

  }

