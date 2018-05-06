require("dotenv").config();
var keys = require("./keys.js"), Twitter = require("twitter"), Spotify = require("node-spotify-api"), OmdbApi = require('omdb-api-pt'), fs = require("fs");
var spotify = new Spotify(keys.spotify), client = new Twitter(keys.twitter), omdb = new OmdbApi({
    apiKey: "trilogy",
    baseUrl: 'https://omdbapi.com/'
});
var command = process.argv[2], songName = "The Sign", movieName = "Mr. Nobody", logString = command;
function displayTweets() {
    client.get('statuses/user_timeline', { screen_name: "Eric05420935", count: 20 }, function (error, tweets, response) {
        logString += "\n";
        for (let i = 0; i < tweets.length; i++) {
            console.log("Tweet:", tweets[i].text, " Created:", tweets[i].created_at);
            logString += "Tweet: " + tweets[i].text + " Created:" + tweets[i].created_at + "\n";
        }
        logString+="\n";
        logData(logString);
    });
}

function displaySpotify(song) {
    spotify.search({ type: 'track', query: song, limit: 10 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        logString += " " + song + "\nSearch Results:\n";
        console.log("Search Results:\n");
        for (let i = 0; i < data.tracks.items.length; i++) {
            const track = data.tracks.items[i];
            var artistString = "";
            for (let i = 0; i < track.artists.length; i++) {
                artistString += track.artists[i].name + ", ";
            }
            artistString = artistString.slice(0, artistString.length - 2);
            console.log("Artists:", artistString);
            logString += "Artists: " + artistString + "\n";
            console.log("Song Name:", track.name);
            logString += "Song Name: " + track.name + "\n";
            console.log("Preview:", track.preview_url);
            logString += "Preview: " + track.preview_url + "\n";
            console.log("Album:", track.album.name, "\n");
            logString += "Album: " + track.album.name + "\n\n";
        }
        logData(logString);
    });
}

function displayMovie(movie) {
    omdb.byId({
        title: movie,
        page: 1
    }).then(res => {
        logString += " " + movie + "\n";
        console.log("Title:", res.Title);
        logString += "Title: " + res.Title + "\n";
        console.log("Year:", res.Year);
        logString += "Year: " + res.Year + "\n";
        console.log("IMDB Rating:", res.imdbRating);
        logString += "IMDB Rating: " + res.imdbRating + "\n";
        for (let i = 0; i < res.Ratings.length; i++) {
            if (res.Ratings[i].Source == "Rotten Tomatoes") {
                console.log("Rotten Tomatoes Rating:", res.Ratings[i].Value);
                logString += "Rotten Tomatoes Rating:" + res.Ratings[i].Value + "\n";
            }
        }
        console.log("Country Produced:", res.Country);
        logString += "Country Produced: " + res.Country + "\n";
        console.log("Language:", res.Language);
        logString += "Language: " + res.Language + "\n";
        console.log("Plot:", res.Plot);
        logString += "Plot: " + res.Plot + "\n";
        console.log("Actors:", res.Actors);
        logString += "Actors: " + res.Actors + "\n\n";
        logData(logString);
    }).catch(err => console.error(err));
}

function logData(data) {
    fs.appendFile("log.txt", data + "\n", function (err) {
        if (err) {
            console.log(err);
        }
    });
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
            case "my-tweets": logString += " my-tweets";
                displayTweets();
                break;
            case "spotify-this-song": logString += " spotify-this-song";
                if (dataArr[1]) { songName = dataArr[1]; }
                displaySpotify(songName);
                break;
            case "movie-this": logString += " movie-this";
                if (dataArr[1]) { movieName = dataArr[1]; }
                displayMovie(movieName); break;
            default: console.log("That is not a valid request.");
        }
    });
        break;
    default: console.log("That is not a valid request.");
}