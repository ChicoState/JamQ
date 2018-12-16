addSong(id) {
    var db = this.songs;
    var ul = this.user_list;
    this.spotifyApi.getTrack(id)
      .then(function (data) {
        let track = data.body;
        var inqueue = false;
        var index;
        var key;
        var song_likes;
        db.subscribe(songs => {
          for (index = 0; index < songs.length; index++) { //for loop to search for songid
            if (songs[index].songid == id) {
              key = songs[index].$key; 
              song_likes = songs[index].likes;
              inqueue = true;
              break;
            }
          }
        })
        if (inqueue == false) {
          db.push({ 
            artist: track.artists['0'].name,
            title: track.name,
            songid: id,
            img: track.album.images['0'].url,
            likes: 1,// change to spotify users
          });
          ul.push({
            song: track.name,
            likes: 1,
          });

        } else {

          db.update(key, { likes: song_likes + 1 }); //likes update
        }

      }, function (err) { //error checking
        console.log('Something went wrong!', err);
      });
  }

