// Require File System
var fs = require('fs');

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

// Inquirer Input Package
var inquirer = require("inquirer");

// Spotify Search Function
function searchSpotify(title, art, lim) {

    // Takes In Song Title
    spotify
    .search({ type: 'track', query: '"' + title.replace(/ /g, "+") + '"', limit: lim})

    // Song Info Is Logged To Console
    .then(function(response) {
        // console.log('Artist Name: ', response.tracks.items[0].album.artists[0].name)

        // Loops Through Responses To Find Artist Match
        for (var i = 0; i < response.tracks.items.length; i++) {

            // If Artist Matches; Logs Info To Console
            if (response.tracks.items[i].album.artists[0].name === art) {
                console.log('');
                console.log("-------------------------------------------------------------------");
                console.log("Artist(s): ", response.tracks.items[i].album.artists[0].name);
                console.log("Song Title: ", response.tracks.items[i].name);
                console.log("Album Title: ", response.tracks.items[i].album.name);
                if (response.tracks.items[i].preview_url === null) {
                    console.log("Spotify Preview URL: Sorry! Spotify doesn't have a preview for this song. :(")
                } else {
                    console.log("Spotify Preview URL: ", response.tracks.items[i].preview_url);
        
                }
                console.log("-------------------------------------------------------------------");
                console.log(''); 
            
            // If Artist Is Undefined, Info From 1st Result Logs To Console
            } else if (art === undefined){
                console.log('');
                console.log("-------------------------------------------------------------------");
                console.log("Artist(s): ", response.tracks.items[i].album.artists[0].name);
                console.log("Song Title: ", response.tracks.items[i].name);
                console.log("Album Title: ", response.tracks.items[i].album.name);
                if (response.tracks.items[i].preview_url === null) {
                    console.log("Spotify Preview URL: Sorry! Spotify doesn't have a preview for this song. :(")
                } else {
                    console.log("Spotify Preview URL: ", response.tracks.items[i].preview_url);
        
                }
                console.log("-------------------------------------------------------------------");
                console.log(''); 
            }
        }

    })
    .catch(function(err) {
        console.log(err);
     });
  }

// OMDB Search Function
function searchOMDB (URL) {

    // Takes In URL and Consoles Logs Movie Info
    request(URL, function(error, response, body) {        
        // If the request was successful...
        if (!error && response.statusCode === 200) {
        // Then Log Movie Info
        console.log('');
        console.log("-------------------------------------------------------------------");
        console.log("Title: " + JSON.parse(body).Title);
        console.log("Year: " + JSON.parse(body).Year);
        console.log("imdbRating: " + JSON.parse(body).imdbRating);
        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
        console.log("Country: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
        console.log("-------------------------------------------------------------------");
        console.log('');
        }
    });

}

// Function to Display 20 Tweets From Twitter Feed
function twitterFeed() {
        // Limit Tweets to 20
        var params = {count: '20'};
        // Twitter GET Request
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if(error) throw error;
            // Loops Through Array of Tweets
            for (i = 0; i < tweets.length; i++) {
                // Logs Tweet Text to Console
                console.log('');
                console.log('Tweet: ');
                console.log(tweets[i].text);
                console.log('');
                // Logs Date Created to Console
                console.log('Date Tweeted: ')
                console.log(tweets[i].created_at);
                console.log('');
                console.log("-------------------------------------------------------------------");
            }
          });
}


// First Prompt The User To Choose A Liri Command
inquirer.prompt([

    {
      type: "list",
      name: "userInput",
      message: "Liri here. What can I do for you?",
      choices: ["Find Movie", "Find Song", "Twitter Feed", "It does as it's told..."]
    }
  // After Prompt, Store The User's Choice as command
  ]).then(function(command) {
    //   console.log('User Command: ", command);
    console.log("-------------------------------------------------------------------");

    // If User Chose "Find Movie"
    if (command.userInput === 'Find Movie') {
        // console.log('User Command: ", command)

        // Ask The User To Type A Movie Title
        inquirer.prompt([
            {
                type: 'input',
                name: 'movieTitle',
                message: "Which movie?"
            }

        // Then Save That As movie
        ]).then(function(movie){
            // console.log("Movie Title: ", movie)

            // If The User Left Input Blank
            if (movie.movieTitle === ''){

                // Mr. Nobody URL is Used To Call Function
                var queryUrl = "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy";

                searchOMDB(queryUrl);
            
            // If The User Typed A Movie Title
            } else {

                // User Input Is Used To Call Function
                var movieTitle = movie.movieTitle.replace(/ /g, "+");
                var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy";
                // console.log("Query URL", queryUrl)

                searchOMDB(queryUrl);
            }
        })
    
    // If User Chose "Find Song"
    } else if (command.userInput === 'Find Song') {

        // Asks The User For Song Title and Artist
        inquirer.prompt([
            {
                type: 'input',
                name: 'songTitle',
                message: "Which song?"
            },
            {
                type: 'input',
                name: 'artist',
                message: "Which artist?"
            }
        
        // User Input Is Saved As song
        ]).then(function(song){
            // console.log("Song Info: ", song);

            // If User Didn't Input Song And Artist
            if (song.songTitle === "" && song.artist === "") {

                // "The Sign" Is Used In Function Call
                searchSpotify("The Sign", "Ace of Base", 1)
            
            // If Song Title Is Blank, But User Input Artist, They Are Prompted To Try Again
            } else if (song.songTitle === "") {
                console.log("Sorry! Please input song title.")

            // If The Artist Input Is Left Blank...
            } else if (song.artist === "") {

                searchSpotify(song.songTitle, undefined, 1);
            
            // If Song And Artist Are Provided...
            } else {
                // Capitalizes First Letter Of Each Word
                var songArtist = song.artist.replace(/(^|\s)[a-z]/g,function(f){return f.toUpperCase();})
                searchSpotify(song.songTitle, songArtist, 50)
            }
            })

    // If User Chose "Twitter Feed"; 20 Tweets From Feed Are Logged To Console
    } else if (command.userInput === 'Twitter Feed') {
        twitterFeed();


    // If User Chose "It Does As It's Told"
    } else if (command.userInput === "It does as it's told...") {
        fs.readFile('random.txt', 'utf8', function(err, data) {
            var dataArray = data.split(',');
            // console.log(dataArray)

            if (dataArray[0] === "Search Spotify") {
                console.log("Searching Spotify for ", dataArray[1])
                searchSpotify(dataArray[1], undefined, 1);
            } else if (dataArray[0] === "Search IMDB") {
                console.log("Searching IMDB for ", dataArray[1])
                var movieTitle = dataArray[1].replace(/ /g, "+");
                // console.log('Movie Title: ', movieTitle)
                var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy";
                searchOMDB(queryUrl);
            } else if (dataArray[0] === "Twitter"){
                console.log("Here's your Twitter Feed...")
                twitterFeed();
            }
        })

    }
  });
