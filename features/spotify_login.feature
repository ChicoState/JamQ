spotifyLogin() {
    if (this.isMobile == true) {
      //is phone
      this.mobileAuth();
      let spotify = document.getElementById("spotify");
      let spotifyfull = document.getElementById("spotifyfull");
      spotify.style.visibility = "visible";
      let page = document.getElementById("page");
      spotifyfull.style.visibility = "hidden";
      // page.replaceChild(spotify, spotifyfull);
    } else {
      //is web
      this.webAuth();
      let spotify = document.getElementById("spotify");
      let spotifyfull = document.getElementById("spotifyfull");
      spotify.style.visibility = "visible";
      let page = document.getElementById("page");
      spotifyfull.style.visibility = "hidden";
      // page.replaceChild(spotify, spotifyfull);
    }

    console.log("spotify token after login: " + this.spotifyToken);
  }

