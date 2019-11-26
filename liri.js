//Requiring the dotenv file package & set any environment variables
const dotenv = require("dotenv").config();
const keys = require("./keys.js");
const axios = require("axios");
const Spotify = require('node-spotify-api');
const fs = require('fs');


const moment = require('moment');
const now = moment().format("YYYY-MM-DD"); //so we can convert this for bands in town and reformat the result
const oneYear = moment().add(365, "days").format("YYYY-MM-DD");
// console.log(oneYear);
// console.log(now);
// console.log (moment)

// how to access spotify keys 
const spotify = new Spotify(keys.spotify);
const bands = keys.bands.id;
const movieAPI = keys.movie.id;

///error for DOTENV
if (dotenv.error) {
  throw dotenv.error
}
// console.log(dotenv.parsed);

//this will be what liri looks for 
const liriCommand = process.argv[2];
const userSearch = process.argv[3];


/////////////////////////////////using inquierer

// const questions = [{

//   type: 'list',
//   choices: [
//     'Search for a movie',
//     'Search for a song',
//     'Search for an event',
//   ],
//   message: "what do you want to do?"
// }]

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
        console.log(
          "\n" + "One moment please......." +
          "\n"+ "\n"+ "We are so very sorry!" + "\n"+  "There is little we can do" + "\n"
        + "because there is no record of this artist in our database" + "\n" + "please try again later" + "\n");
      }

      console.log("\n"+ "|||||||||||||||||||||||||||||||||| LIRI UPCOMING CONCERT DATABASE ||||||||||||||||||||||||||||||||||" + "\n")
      for (let i = 0; i < artistInfo.length; i++) {

        let eventTime = artistInfo[i].datetime;
        let eventDate = moment(eventTime).format("MM-DD-YYYY");

        console.log(eventDate + " --- " + artistInfo[i].venue.city + ", " + 
        artistInfo[i].venue.region + " --- " + artistInfo[i].venue.name);
      }
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
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
      // If the axios was successful...
      // Then log the body from the site!
      const movieInfo = response.data;
      //TO DO:
      // MAKE LOOP for multiple words, PRINT ERROR MESSAGES, IF ONE VALUE IS UNDEFINED KEEP PRINTING 
      if (userSearch === undefined) {
        let userSearch = "Mr.+Nobody";
        axios
          .get(`http://www.omdbapi.com/?apikey=${movieAPI}&t=${userSearch}`) //&date=2015-05-05,2017-05-05
          .then(function (response) {
            // If the axios was successful...
            // Then log the body from the site!
            const movieInfo = response.data;
            console.log(
              "\n"+ "|||||||||||||||||||||||||||||||||| LIRI MOVIE DATABASE ||||||||||||||||||||||||||||||||||" + "\n" +
              "\n" + "Movie Title: " + movieInfo.Title +                  
              "\n" +"Movie Year: " + movieInfo.Year +
              "\n" +"IMDB Rating: " + movieInfo.imdbRating +
              "\n" + "Rotten Tomato Score: " + movieInfo.Ratings[1].Value +
              "\n" + "Produced in: " + movieInfo.Country +
              "\n" + "Language: " + movieInfo.Language +
              "\n" + "Plot Description: " + movieInfo.Plot +
              "\n" + "Key Actors: " + movieInfo.Actors + "\n");
          })
      } else {
        console.log(
          "\n"+ "|||||||||||||||||||||||||||||||||| LIRI MOVIE DATABASE ||||||||||||||||||||||||||||||||||" + "\n" +
          "\n" + "Movie Title: " + movieInfo.Title +
          "\n" +"Movie Year: " + movieInfo.Year +
          "\n" +"IMDB Rating: " + movieInfo.imdbRating +
          "\n" + "Rotten Tomato Score: " + movieInfo.Ratings[1].Value +
          "\n" + "Produced in: " + movieInfo.Country +
          "\n" + "Language: " + movieInfo.Language +
          "\n" + "Plot Description: " + movieInfo.Plot +
          "\n" + "Key Actors: " + movieInfo.Actors + "\n")
      }
      // if artist doesnt exist then it will spit out this message
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
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

      console.log(response);
      let songs = response.tracks.items
      console.log(songs);
      for (i = 0; i < songs.length; i++)
        console.log(songs[i].album.artists[0].name + songs[i].name + songs[i].album.name + songs[i].external_urls.spotify)
    })
    .catch(function (err) {
      console.log(err);
    });
};

//do-what-it-says function 

function DoIt() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    console.log(data);
    const dataArr = data.split(",");
    console.log(dataArr);
    dataArr[1] = userSearch; 
    dataArr[0]= liriCommand;
    // switch(liriCommand){}
  })

}