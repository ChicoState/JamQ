addSong(id) {
    //move songlist to loval variable
    var db = this.songs;
    var ul = this.user_list;
    //call spotify api for song information
    this.spotifyApi.getTrack(id)
      .then(function (data) {
        //shorten call
        let track = data.body;
        //send track information to firebase
        var inqueue = false;
        var index;
        var key;
        var song_likes;
        //if song is in the queue, add one like
        //otherwise add to queue
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

            //maybe make a new table with likes columns of users who liked it and new table of users who disliked it 
            likes: 1,// change to spotify users
            //dislikes: 0 // change to spotify users
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

