require("dotenv").config();
var keys = require("./keys.js"), Twitter = require("twitter"), Spotify = require("node-spotify-api"), OmdbApi = require('omdb-api-pt'), fs = require("fs");
var spotify = new Spotify(keys.spotify), client = new Twitter(keys.twitter), omdb = new OmdbApi({
    apiKey: "trilogy",
    baseUrl: 'https://omdbapi.com/'
});
var command = process.argv[2], songName = "The Sign", movieName = "Mr. Nobody";
function displayTweets() {
    client.get('statuses/user_timeline', { screen_name: "Eric05420935", count: 20 }, function (error, tweets, response) {
        for (let i = 0; i < tweets.length; i++) {
            console.log("Tweet:", tweets[i].text, " Created:", tweets[i].created_at);
        }
    });
}

function displaySpotify(song) {
    spotify.search({ type: 'track', query: song, limit: 10 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Search Results:\n");
        for (let i = 0; i < data.tracks.items.length; i++) {
            const track = data.tracks.items[i];
            var artistString = "";
            for (let i = 0; i < track.artists.length; i++) {
                artistString += track.artists[i].name + ", ";
            }
            artistString = artistString.slice(0, artistString.length - 2);
            console.log("Artists:", artistString);
            console.log("Song Name:", track.name);
            console.log("Preview:", track.preview_url);
            console.log("Album:", track.album.name, "\n");
        }
    });
}

function displayMovie(movie) {
    omdb.byId({
        title: movie,
        page: 1
    }).then(res => {
        console.log("Title:", res.Title);
        console.log("Year:", res.Year);
        console.log("IMDB Rating:", res.imdbRating);
        for (let i = 0; i < res.Ratings.length; i++) {
            if (res.Ratings[i].Source == "Rotten Tomatoes") {
                console.log("Rotten Tomatoes Rating:", res.Ratings[i].Value);
            }
        }
        console.log("Country Produced:", res.Country);
        console.log("Language:", res.Language);
        console.log("Plot:", res.Plot);
        console.log("Actors:", res.Actors);
    }).catch(err => console.error(err));
}

switch (command) {
    case "my-tweets": displayTweets(); break;
    case "spotify-this-song": if (process.argv[3]) { songName = process.argv[3]; }
        displaySpotify(songName);
        break;
    case "movie-this": if (process.argv[3]) { movieName = process.argv[3]; }
        displayMovie(movieName);
        break;
    case "do-what-it-says": fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        switch (dataArr[0]) {
            case "my-tweets": displayTweets(); break;
            case "spotify-this-song": if (dataArr[1]) { songName = dataArr[1]; }
                displaySpotify(songName);
                break;
            case "movie-this": if (dataArr[1]) { movieName = dataArr[1]; }
                displayMovie(movieName); break;
            default: console.log("That is not a valid request.");
        }
    });
        break;
    default: console.log("That is not a valid request.");
}