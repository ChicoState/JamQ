import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,  } from 'ionic-angular';
import { OAuth as OAuthWeb } from 'oauthio-web';
import { OAuth } from 'oauth-phonegap';
import { Platform } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ProfilePage } from '../profile/profile';



/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})

export class SearchPage {
  spotifyApi: any;
  songs: FirebaseListObservable<any>;
  artist: FirebaseListObservable<any>;
  user_list: FirebaseListObservable<any>;
  key: any;
  isMobile: any;
  that: this;
  spotify: any;
  searchbar: any;


  constructor(
    public platform: Platform, public navCtrl: NavController,
    public navParams: NavParams, public af: AngularFireDatabase,
    private afAuth: AngularFireAuth) {

    this.afAuth.authState.subscribe(auth => {
      this.af.object(`users/${auth.uid}`).take(1).subscribe(data => {
        this.user_list = af.list("/" + partyKey + "/userlist/" + data.username + "/likes");
    });
    });

      //checks if device is mobile or Web
    if (platform.is('cordova')) { this.isMobile = true; }
      else { this.isMobile = false; }

      var partyKey = sessionStorage['partyCookie'];
      //console.log(partyKey);
      this.songs = af.list("/" + partyKey + "/songlist");
      //getting spotify api library
      var SpotifyWebApi = require('spotify-web-api-node');
      //build api with no params
      this.spotifyApi = new SpotifyWebApi();

      //switches Auth method based on if mobile or web
      if (this.isMobile) {
        //is phone
        //gets auth from cache named 'spotify'
        this.spotify = OAuth.create('spotify');
      } else {
        //is web
        //gets auth from cache named 'spotify'
        this.spotify = OAuthWeb.create('spotify');
        console.log("is Web");
      }
      //sets access token of authenticated user
      this.spotifyApi.setAccessToken(this.spotify.access_token);
  }

  getItems(ev: any, that ) {
    document.getElementById("list").style.visibility = "visible";
    //gets the list that displays songs
    var temparr = [];
    var songname= [];
    // set val to the value of the searchbar
    let queryTerm = ev.target.value;
    // if the value is an empty string don't filter the items
    if (queryTerm && queryTerm.trim() != '') {
    //search track titles and return top 10 results
    var prev = this.spotifyApi.searchTracks(queryTerm, {limit: 6})
    .then(function(data, that) {
          //song object for easier calls
          let song = data.body.tracks;
          // clean the promise so it doesn't call abort
          prev = null;
          //for loop that iterates through the 10 songs returned from api
          //sends html for each one to page
          for(var i = 0; i < 6; i++)
          {
            //checks if element exists
            if(!song.items[i]) {
               continue;
            }
            i.toString();
            //artist name
           //document.getElementById('artist' + i ).innerHTML = song.items[i].artists['0'].name;
            var nameartist= song.items[i].artists['0'].name;
            temparr.push(nameartist);
            //album cover
            //document.getElementById('img' + i ).setAttribute('src', song.items[i].album.images[0].url);
            //song title
           // if(){
            //var title = document.getElementById('title' + i );
           // }
           //title.innerHTML = song.items[i].name;
            songname.push(song.items[i].name);
            //pass track id to page
           // title.setAttribute("data-songid", song.items[i].id);
          }
          /******************
          Search by songs, no duplicates
          ****************/
        songname=songname.filter(function(elem, index, self) {
                 return index == self.indexOf(elem);
        })
        var ns= songname.length;
        //if no duplicates only 5 songs are shown
        if(ns>5){
          ns=5;
        }
        for(var x = 0; x <ns; x++)
        {
          var title = document.getElementById('title' + x);
          var ind = x.toString();
          document.getElementById('artist' + ind ).innerHTML = song.items[ind].artists['0'].name;
          document.getElementById('img' + ind ).setAttribute('src', song.items[ind].album.images[0].url);
          title.innerHTML = songname[x];
          title.setAttribute("data-songid", song.items[ind].id);
         }

    }, function(err) { //some error checking
      console.error(err);
    })
     //document.getElementById('Artists').innerHTML='Artists'
     var pre = this.spotifyApi.searchArtists(queryTerm, {limit: 5})
          .then(function(data, that) {
            let artist = data.body.artists;
            // clean the promise so it doesn't call abort
            pre = null;
            //for loop that iterates through the 10 songs returned from api
            //sends html for each one to page
           for(var index = 0; index < 5; index++)
            {
              //checks if element exists
              if(!artist.items[index]) {
                continue;
              }else{
                var ie=index.toString();
                var artistn = document.getElementById('artistname' + ie);
                if(artist.items[index].images[0]){
                  document.getElementById('imag' + ie ).setAttribute('src', artist.items[index].images[0].url);
                  artistn.innerHTML = artist.items[ie].name;
                }else{
                  document.getElementById('imag' + ie ).setAttribute('src',"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS87NixlNcf6A52z5o0v8Lx-wcwdQlxOTjc4AwWzEALPSQk0VuStw");
                }
              }
            }
          }, function(err) { //some error checking
            console.error(err);
          })
    }else{
      /**************
      If search bar is empty, delete elements
      ***************/
      document.getElementById('list').style.visibility="hidden"; //hide song's list
      for(var i = 0; i <5; i++){
        i.toString();
        document.getElementById('title'+ i).innerHTML=" ";
        document.getElementById('artist'+ i).innerHTML=" ";
        document.getElementById('img' +i).setAttribute('src'," ");
        document.getElementById('artistname' + i).innerHTML=" ";
        document.getElementById('imag' + i ).setAttribute('src', " ");
     }
    }
  }

  ionViewDidLoad() {
    if (this.spotify.access_token) {
      //do something here? or dont.
    }
    else { 
      alert("You need to sign into Spotify to search!");
      this.navCtrl.setRoot(ProfilePage);
      /* let searchpage = document.getElementById('searchpage');
      let everything = document.getElementById('everything');
      this.searchbar = everything;
      // let addSpotify = document.getElementById('addSpotify');
      everything.parentNode.removeChild(everything);
      // searchpage.style.backgroundColor = 'grey';
      let img = document.createElement('img');
      img.setAttribute('src','https://static1.squarespace.com/static/551ed270e4b07f2b9a28489c/t/59848e13f7e0ab6f61df1b05/1501859351405/');
      img.style.alignContent = 'center';
      img.style.height = '50px';
      img.style.width = '50px';
      var spotifyauth = this.spotifyLogin.bind(this)
      img.onclick = spotifyauth;
      // img.setAttribute('onclick','this.spotifyLogin()');
      searchpage.replaceChild(img,searchpage.childNodes[0]); */
    }
    console.log('ionViewDidLoad SearchPage');
  }

  spotifyLogin() {
    let searchpage = document.getElementById('searchpage');

    if (this.isMobile == true) {
      //is phone
      this.mobileAuth();
      searchpage.replaceChild(this.searchbar,searchpage.childNodes[0])

    } else {
      //is web
      this.webAuth();
      searchpage.replaceChild(this.searchbar,searchpage.childNodes[0])
    }

  }

  itemTapped(index) {
    //get songid from song clicked
    var id = document.getElementById('title'+index).getAttribute("data-songid");
    //move songlist to loval variable
    var db = this.songs;
    var ul= this.user_list
    //call spotify api for song information
        this.spotifyApi.getTrack(id)
          .then(function(data) {
            //shorten call
            let track = data.body;
            //send track information to firebase
         var inqueue = false;
         var index;
         var key;
         var song_likes;
       //if song is in the queue, add one like
       //otherwise add to queue
        db.subscribe(songs =>{
         for( index=0;index<songs.length;index++){ //for loop to search for songid
           if(songs[index].songid==id){
             key= songs[index].$key;
             song_likes= songs[index].likes;
             inqueue=true;
              break;
           }
          }
         })
         if(inqueue==false){
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
            song :track.name,
            likes: 1,
          });

        }else{


        db.update(key, { likes: song_likes + 1 }); //likes update
        }

        }, function(err) { //error checking
        console.log('Something went wrong!', err);
    });
  }

  //use for authentiating with mobile libraries
mobileAuth(){
  //initializes spotify auth
  OAuth.initialize('NJG7cpjPQHkVhSQgvpQi5MRoyM4');
  //popup for spotify login
  //then resets html to wait for auth to complete
    //idealy this would be a loading feature to wait until popup closes with success
  //on error sends alert  to page for debbuging
  let spotifyApi = this.spotifyApi;
    OAuth.popup('spotify',{cache: true}).done(function(spotify) {
      spotifyApi.setAccessToken(spotify.access_token);
    }).then(     ).fail(function(err) {
      alert("Error with spotify login");
    });

}

//use for authenticating with web libraries
webAuth() {
  var spotify = OAuthWeb.create('spotify');
  if(spotify.access_token){
    // console.log(spotify.access_token);

  } else {
  OAuthWeb.initialize('NJG7cpjPQHkVhSQgvpQi5MRoyM4');
    //popup for spotify login
    //then resets html to wait for auth to complete
      //idealy this would be a loading feature to wait until popup closes with success
    //on error sends alert  to page for debbuging
    let spotifyApi = this.spotifyApi;
      OAuthWeb.popup('spotify',{cache: true}).done(function(spotify) {
        spotifyApi.setAccessToken(spotify.access_token);
      }).then(       ).fail(function(err) {
        alert("Error with spotify login");
      });
    }

}

}
