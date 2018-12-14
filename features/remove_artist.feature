removeArtist(songid) {
    this.artists.forEach(song => {
      song.forEach(song => {
        if (song.id == songid) {
          this.artists.remove(song.$key);
        }
      })
    });
  }

