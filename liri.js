// Twitter Keys
var client = require("./keys.js");

// OMDB Request
var request = require("request");

// Spotify Request
var Spotify = require('node-spotify-api');

var spotify = new Spotify({
    id: 'c076ea91c37546cb98d223008e21e4a5',
    secret: 'e2c51248ff8e454da3418846a2abf6f6'
  });

// OMDB Movie Command
if (process.argv[2] === 'movie-this'){
    // If User Doesn't Input Movie, Default "Mr. Nobody"
    if (process.argv[3] === undefined){
        var queryUrl = "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy";
    // Otherwise, User Input
    }  else {
        var movieName = process.argv.splice(3, process.argv.length).join('+');
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    }
    // OMDB Request
    request(queryUrl, function(error, response, body) {        
        // If the request was successful...
        if (!error && response.statusCode === 200) {
        // Then Log Movie Info
          console.log("Title: " + JSON.parse(body).Title);
          console.log("Year: " + JSON.parse(body).Year);
          console.log("imdbRating: " + JSON.parse(body).imdbRating);
          console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
          console.log("Country: " + JSON.parse(body).Country);
          console.log("Language: " + JSON.parse(body).Language);
          console.log("Plot: " + JSON.parse(body).Plot);
          console.log("Actors: " + JSON.parse(body).Actors);
        }
      });

// Twitter Command
} else if (process.argv[2] === 'my-tweets') {
    // Limit Tweets to 20
    var params = {count: '20'};
    // Twitter GET Request
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if(error) throw error;
        // Loops Through Array of Tweets
        for (i = 0; i < tweets.length; i++) {
            // Logs Tweet Text to Console
            console.log('Tweet: ' + tweets[i].text);
            // Logs Date Created to Console
            console.log('Date Tweeted: ' + tweets[i].created_at);
        }
      });
// Spotify Command
} else if (process.argv[2] === 'spotify-this-song') {
    // spotify.search({ type: 'track', query: 'All the Small Things', limit: 1 }, function(err, data) {
    //     if (err) {
    //       return console.log('Error occurred: ' + err);
    //     }
       
    //   console.log(data); 
    //   });
}

spotify
  .search({ type: 'track', query: 'All the Small Things' })
  .then(function(response) {
    console.log(response);
  })
  .catch(function(err) {
    console.log(err);
  });

// spotify
//   .request('https://api.spotify.com/v1/tracks/7yCPwWs66K8Ba5lFuU2bcx')
//   .then(function(data) {
//     console.log(data); 
//   })
//   .catch(function(err) {
//     console.error('Error occurred: ' + err); 
//   });
// artists[0].name
// .name

// album[0].name