  like(song) { 
    var temp = []; 
    this.likeCheck = this.af.list("/" + this.partyKey + "/userlist/" + this.username + "/likes");
    this.likeCheck.subscribe(data => {
      data.forEach(item => {
        // console.log(item.song)
        temp.push(item.song)
      })

    })
    //console.log(temp)
    var check = false; 
    if (temp.length == 0) {
      this.user_likes.push({ song: song.$key });
      this.songs.update(song.$key, { likes: song.likes + 1 });
      check = true;
    } else {
      for (var i = 0; i < temp.length; i++) {
        console.log("checking songs")
        if (temp[i] == song.$key) {
          check = true;
          break;
        }
      }
    }


    if (check == false) {
      this.user_likes.push({ song: song.$key });
      this.songs.update(song.$key, { likes: song.likes + 1 });
    }
  }

