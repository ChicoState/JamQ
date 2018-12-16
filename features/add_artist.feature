addArtist(id) {
    var db = this.artists;
    var ul = this.user_list;
    this.spotifyApi.getArtist(id)
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

          var image;

          if (track.images.length != 0) {
            image = track.images[0].url;
          } else {
            image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS87NixlNcf6A52z5o0v8Lx-wcwdQlxOTjc4AwWzEALPSQk0VuStw"
          }


          db.push({
            name: track.name,
            id: track.id,
            img: image,
            likes: 1,
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

