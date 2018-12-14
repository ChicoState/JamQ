spotifyLogout() {
    if (this.isMobile == true) {
      this.spotify = OAuth.clearCache();
      let spotify = document.getElementById("spotify");
      let spotifyfull = document.getElementById("spotifyfull");
      spotify.style.visibility = "hidden";
      let page = document.getElementById("page");
      spotifyfull.style.visibility = "visible";
      this.spotifyApi.resetCredentials();
    } else {
      this.spotify = OAuthWeb.clearCache();
      let spotify = document.getElementById("spotify");
      let spotifyfull = document.getElementById("spotifyfull");
      spotify.style.visibility = "hidden";
      let page = document.getElementById("page");
      spotifyfull.style.visibility = "visible";
      this.spotifyApi.resetCredentials();
    }
  }

