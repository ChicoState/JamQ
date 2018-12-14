itemTapped(index) { 

    switch (this.searchlist) {
      case "songs":
        { 
          this.addSong(index);
        }
        break;
      case "artists":
        { 
          this.addArtist(index);
        }
        break;
      default:
        { 
          console.log("Error! No tab selected!");
          return;
        }
    }

