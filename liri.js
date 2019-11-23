//Requiring the dotenv file package & set any environment variables
const dotenv = require("dotenv").config();

const keys = require("./keys.js");

///////// DOT ENV CONFIG 

// con
 
if (dotenv.error) {
  throw dotenv.error
}
 
console.log(dotenv.parsed)


// const spotify = new Spotify(keys.spotify);


//// HERE ARE THE COMMANDS WE WANT LIRI TO RUN
/*
concert-this

spotify-this-song

movie-this

do-what-it-says

*/