searchArtists(queryTerm: String) {

    //Each query should have a new list
    this.artistslist = [];

    //This magically lets you use songlist inside a promise
    var artistslist = this.artistslist;

    this.spotifyApi.searchArtists(queryTerm, { limit: 50 })
      .then(function (data) {
        //Get all returned artists from search
        let artists = data.body.artists.items;

        for (let i = 0; i < artists.length; i++) {
          //Get data from each artist and update the html with it
          let name = artists[i].name;

          let id = artists[i].id;

          //Image may be absent
          let image;
          if (artists[i].images.length != 0) {
            image = artists[i].images[0].url;
          } else {
            //Use temp image
            image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS87NixlNcf6A52z5o0v8Lx-wcwdQlxOTjc4AwWzEALPSQk0VuStw"
          }

          //Add the artist the the list, html will be updated dyanmcally automagically
          artistslist.push({ "name": name, "image": image, "id": id });
        }
      })
  }

