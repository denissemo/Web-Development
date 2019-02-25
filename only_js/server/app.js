// Requires

const express = require("express");
const morgan = require("morgan");  // request logger
const path = require('path');
const MongoClient = require("mongodb").MongoClient;


const app = express();  // main app

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(morgan("dev"));
const jsonParser = express.json();

// Connect to MongoDb
const mongoClient = new MongoClient("mongodb://localhost:27017/", {useNewUrlParser: true});
let dbClient;

app.use(express.static(__dirname + "/public"));


mongoClient.connect(function (err, client) {
    if (err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("tracks").collection("users");
    app.listen(3000, function () {
        console.log("Server started on localhost:3000");
    });
});

app.get("/tracks", function (request, response) {
    const collection = request.app.locals.collection;
    collection.find().toArray(function (err, result) {
        if (err) return console.log(err);
        for (let obj of result) {
            if (request.query.username in obj) {
                // console.log(obj);
                let data = obj[request.query.username];
                // unique data
                data = data.filter((data, index, self) =>
                    index === self.findIndex((t) => (
                        t.artist === data.artist && t.title === data.title
                    ))
                );
                console.log("-- read from db");
                response.render("tracks.hbs", {Title: "Tracks", table: data});
                return;
            }
        }
        console.log("-- write to db");
        get_info(request.query.username, request, response);
    });
});


app.get("/", function (request, response) {
    response.render("index.hbs", {Title: "Last.fm parser"});
});

function get_info(username, req, res) {
    // parse music information
    const request = require("request"),
        cheerio = require("cheerio"),
        url = `https://www.last.fm/user/${username}/library/tracks`;
    // const fs = require('fs');
    request(url, function (error, response, body) {
        let tracks = [];
        if (!error) {
            var $ = cheerio.load(body),
                Obj = $("#top-tracks-section > table > tbody > tr");
            // console.log(Obj.length);
            for (let i = 0; i < $("table.chartlist tbody tr").length; i++) {
                let track = $(Obj.find("td.chartlist-name > span > a")[0]).attr('title');
                tracks.push({
                    artist: track.substring(0, track.indexOf("—") - 1),
                    title: track.substring(track.indexOf("—") + 2)
                });
                Obj = Obj.next();
            }
            const collection = req.app.locals.collection;
            console.log("INSERTION to DB");
            collection.updateOne({[username]: tracks}, {$set: {[username]: tracks}}, {upsert: true}, function (err) {
                if (err) console.error(err);
                console.log("Inserted");
                // unique data
                tracks = tracks.filter((tracks, index, self) =>
                    index === self.findIndex((t) => (
                        t.artist === tracks.artist && t.title === tracks.title
                    ))
                );
                res.render("tracks.hbs", {Title: "Tracks", table: tracks});
            });
        } else {
            console.error("An error occurred: " + error);
        }
    });
}
