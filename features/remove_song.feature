remove(songid) {
    this.songs.forEach(song => {
      song.forEach(song => {
        if (song.songid == songid) {
          this.songs.remove(song.$key);
        }
      })
    });
  }

