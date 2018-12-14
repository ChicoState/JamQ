searchSongs(queryTerm: String) {

    //Each query should have a new list
    this.songslist = [];

    //This magically lets you use songlist inside a promise
    var songslist = this.songslist;

    this.spotifyApi.searchTracks(queryTerm, { limit: 50 })
      .then(function (data) {

        //Get all returned songs from search
        let songs = data.body.tracks.items;

        for (let i = 0; i < songs.length; i++) {
          //Get data from each song and update the html with it

          let title = songs[i].name;
          let artist = songs[i].artists[0].name;
          let songid = songs[i].id;

          //Image may be absent
          let image;
          if (songs[i].album.images.length != 0) {
            image = songs[i].album.images[0].url;
          } else {
            //Use temp image
            image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS87NixlNcf6A52z5o0v8Lx-wcwdQlxOTjc4AwWzEALPSQk0VuStw"
          }
          
          //Add the song the the list, html will be updated dyanmcally automagically      
          songslist.push({ "title": title, "artist": artist, "image": image, "id": songid });
        }
      })
  }

