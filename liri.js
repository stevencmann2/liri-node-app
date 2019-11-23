//Requiring the dotenv file package & set any environment variables
const dotenv = require("dotenv").config();
const keys = require("./keys.js");
const axios = require("axios");
var Spotify = require('node-spotify-api');

const moment = require('moment');
const now = moment().format("YYYY-MM-DD"); //so we can convert this for bands in town and reformat the result
const oneYear = moment().add(365, "days").format("YYYY-MM-DD");
// console.log(oneYear);
// console.log(now);
// console.log (moment)

// how to access spotify keys 
const spotify = new Spotify(keys.spotify);


///error for DOTENV
if (dotenv.error) {
  throw dotenv.error
}
// console.log(dotenv.parsed);

//this will be what liri looks for 
const liriCommand = process.argv[2];
const userSearch = process.argv[3];


//// HERE ARE THE COMMANDS WE WANT LIRI TO RUN
/*
concert-this
spotify-this-song
movie-this
do-what-it-says
*/


// The switch-case will direct which function gets run.
// switch (liriCommand) {
//     case "concert-this":
//       concertThis();
//       break;
// }

if (liriCommand === "concert-this" && userSearch){
    
    concertThis();
}
    
//     case "spotify-this-song":
//       deposit();
//       total();
//       break;
    
//     case "movie-this":
//       withdraw();
//       total();
//       break;
    
//     case "do-what-it-says":
//       lotto();
//       total();
//       break;
//     }



  // ||||||||||||||||||||||||||||||||||CONCERT THIS FUNCTION |||||||||||||||||||||||||||||||
function concertThis() {
    

  axios
  .get(`https://rest.bandsintown.com/artists/${userSearch}/events?app_id=codingbootcamp&date=${now},${oneYear}`) //&date=2015-05-05,2017-05-05
  .then(function(response) {
    // If the axios was successful...
    // Then log the body from the site!
    console.log(response.data);
    const artistInfo = response.data;

    for (let i=0; i < artistInfo.length; i++ ){

       let eventTime =  artistInfo[i].datetime;
       let eventDate = moment(eventTime).format("MM-DD-YYYY");
      

    console.log(eventDate + ", " + artistInfo[i].venue.city + ", " + artistInfo[i].venue.region + ", " + artistInfo[i].venue.name);   
   
    
    }
   
    //////////////////THIS IS BANDS IN TOWN SPECIFIC
    // console.log(artistInfo.venue.name);   
    // console.log (artistInfo.venue.city);
    //console.log(response.venue.)
  })
  .catch(function(error) {
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

  //spotify-this-song  function

  //movie-this  function

  //do-what-it-says function 



