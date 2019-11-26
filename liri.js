//Requiring the dotenv file package & set any environment variables
const dotenv = require("dotenv").config();
const keys = require("./keys.js");
const axios = require("axios");
const Spotify = require('node-spotify-api');
const fs = require('fs');
const moment = require('moment');
const now = moment().format("YYYY-MM-DD"); //so we can convert this for bands in town and reformat the result
const oneYear = moment().add(365, "days").format("YYYY-MM-DD");


// how to access spotify keys 
const spotify = new Spotify(keys.spotify);
const bands = keys.bands.id;
const movieAPI = keys.movie.id;

///error for DOTENV
if (dotenv.error) {
  throw dotenv.error
}
//this will be what liri looks for 
const liriCommand = process.argv[2];
const userSearch = process.argv[3];

// let nodeArgs = process.argv;
// let userSearch = "";

// //Set up loop to loop through the search paramters
// for (let i = 2; i < nodeArgs.length; i++){

//   if (i > 2 && i < nodeArgs.length){

//     userSearch += nodeArgs[i];
//   }
// }


// The switch-case will direct which function gets run.
switch (liriCommand) {
  case "concert-this":
    concertThis();
    break;
  case "movie-this":
    movieThis();
    break;
  case "spotify-this-song":
    spotifyThis();
    break;
  case "do-what-it-says":
    DoIt();
    break;
}
// ||||||||||||||||||||||||||||||||||CONCERT THIS FUNCTION |||||||||||||||||||||||||||||||
function concertThis() {

  axios
    .get(`https://rest.bandsintown.com/artists/${userSearch}/events?app_id=${bands}&date=${now},${oneYear}`) //&date=2015-05-05,2017-05-05
    .then(function (response) {
      //TO DO:
      //  PRINT ERROR MESSAGES, IF ONE VALUE IS UNDEFINED KEEP PRINTING , MULTIPLE WORDS FOR INPUT LOOP
      const artistInfo = response.data;
      // if artist doesnt exist then it will spit out this message
      if (artistInfo[0] === undefined) {
        console.log("\n" + "|||||||||||||||||||||||||||||||||| LIRI UPCOMING CONCERT DATABASE ||||||||||||||||||||||||||||||||||" + "\n")
        console.log(
           "One moment please......." +
          "\n" + "\n" + "We are so very sorry!" + "\n" + "There is little we can do" + "\n" +
          "because there is no record of this artist in our database" + "\n" + "please try again later" + "\n");
      } else {

        console.log("\n" + "|||||||||||||||||||||||||||||||||| LIRI UPCOMING CONCERT DATABASE ||||||||||||||||||||||||||||||||||" + "\n" +
          "\n" + "One moment please......." + "\n")
        for (let i = 0; i < artistInfo.length; i++) {

          let eventTime = artistInfo[i].datetime;
          let eventDate = moment(eventTime).format("MM-DD-YYYY");

          console.log(eventDate + " --- " + artistInfo[i].venue.city + ", " +
            artistInfo[i].venue.region + " --- " + artistInfo[i].venue.name);
        }
        console.log("\n")
      }
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
};


///////////////////////////////////////////MOVIE FUNCITON USING OMDB||||||||||||||||||||||||||||||||||||

function movieThis() {
  axios
    .get(`http://www.omdbapi.com/?apikey=${movieAPI}&t=${userSearch}`)
    .then(function (response) {
      const movieInfo = response.data;
      //TO DO:
      // MAKE LOOP for multiple words, PRINT ERROR MESSAGES, IF ONE VALUE IS UNDEFINED KEEP PRINTING 
      if (userSearch === undefined) {
        let userSearch = "Mr.+Nobody";
        axios
          .get(`http://www.omdbapi.com/?apikey=${movieAPI}&t=${userSearch}`) //&date=2015-05-05,2017-05-05
          .then(function (response) {

            const movieInfo = response.data;
            console.log(
              "\n" + "|||||||||||||||||||||||||||||||||| LIRI MOVIE DATABASE ||||||||||||||||||||||||||||||||||" + "\n" + "\n" +
              "one moment please..." + "\n" + "\n" +
              "You did not search a movie" + "\n" + "here's an example of what you might want to search" + "\n" +
              "\n" + "Movie Title: " + movieInfo.Title +
              "\n" + "Movie Year: " + movieInfo.Year +
              "\n" + "IMDB Rating: " + movieInfo.imdbRating +
              "\n" + "Rotten Tomato Score: " + movieInfo.Ratings[1].Value +
              "\n" + "Produced in: " + movieInfo.Country +
              "\n" + "Language: " + movieInfo.Language +
              "\n" + "Plot Description: " + movieInfo.Plot +
              "\n" + "Key Actors: " + movieInfo.Actors + "\n");
          })
      } else {
        console.log(
          "\n" + "|||||||||||||||||||||||||||||||||| LIRI MOVIE DATABASE ||||||||||||||||||||||||||||||||||" + "\n" + "\n" +
          "one moment please..." + "\n" +
          "\n" + "Movie Title: " + movieInfo.Title +
          "\n" + "Movie Year: " + movieInfo.Year +
          "\n" + "IMDB Rating: " + movieInfo.imdbRating +
          "\n" + "Rotten Tomato Score: " + movieInfo.Ratings[1].Value +
          "\n" + "Produced in: " + movieInfo.Country +
          "\n" + "Language: " + movieInfo.Language +
          "\n" + "Plot Description: " + movieInfo.Plot +
          "\n" + "Key Actors: " + movieInfo.Actors + "\n")
      }
    })
    .catch(function (error) {
      if (error.response) {

        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {

        console.log(error.request);
      } else {

        console.log("Error", error.message);
      }
      console.log(error.config);
    });
};


///////////////////////////////////   SPOTIFY FUNCTION |||||||||||||||||||||||||||||||||||||||||||
function spotifyThis() {
  spotify
    .search({
      type: 'track',
      query: `${userSearch}`,
      limit: 3
    })
    .then(function (response) {

      // console.log(response);
      let songs = response.tracks.items
      console.log("\n" + "|||||||||||||||||||||||||||||||||| LIRI SONG DATABASE ||||||||||||||||||||||||||||||||||" + "\n" + "\n" +
        "one moment please..." + "\n" + "\n" +
        "Top 3 Spotify results based on search" + "\n" + "\n" +
        "-----------------------------"+ "\n")
      for (i = 0; i < songs.length; i++)
        console.log(

          "Artist: " + songs[i].album.artists[0].name +
          "\n" + "Song Name: " + songs[i].name +
          "\n" + "Album Name: " + songs[i].album.name +
          "\n" + "Spotify Link: " + songs[i].external_urls.spotify +
          "\n" + "\n" +
          "-----------------------------"+ "\n")
    })
    .catch(function (err) {
      console.log(err);
    });
};

//do-what-it-says function 

// function DoIt() {
//   fs.readFile("random.txt", "utf8", function (error, data) {
//     if (error) {
//       return console.log(error);
//     }
//     // console.log(data);
//     const dataArr = data.split(",");
//     console.log(dataArr);


//   });
// };