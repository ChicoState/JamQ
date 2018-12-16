dislikeArtist(song) {
    var temp = [];
    this.dislikeCheck = this.af.list("/parties/" + this.partyKey + "/userlist/" + this.username + "/dislikes");
    this.dislikeCheck.subscribe(data => {
      data.forEach(item => {
        temp.push(item.song)
      })
    })
    var check = false;
    if (temp.length == 0) {
      this.user_dislikes.push({ song: song.$key });
      this.artists.update(song.$key, { likes: song.likes - 1 });
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
      this.user_dislikes.push({ song: song.$key });
      this.artists.update(song.$key, { likes: song.likes - 1 });
    }
  }

