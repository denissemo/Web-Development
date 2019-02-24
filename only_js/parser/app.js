// // подключение express
// const express = require("express");
// // создаем объект приложения
// const app = express();
//
// // Mongo DB
// const MongoClient = require("mongodb").MongoClient;
//
// const url = "mongodb://localhost:27017/";
// const mongoClient = new MongoClient(url, {
//     useNewUrlParser: true
// });
//
// // определяем обработчик для маршрута "/"
// app.get("/", function (request, response) {
//     get_info();
//     console.log("Getting info from db");
//
//     mongoClient.connect(function (err, client) {
//         const db = client.db("tracks");
//         const collection = db.collection("tracks");
//
//         if (err) return console.log(err);
//
//         collection.find().toArray(function (err, result) {
//             console.log(typeof result);
//             console.log(`Result - ${result}`);
//             client.close();
//         });
//     });
//
//     // отправляем ответ
//     response.send("<h2>Привет Express!</h2>");
// });
// // начинаем прослушивать подключения на 3000 порту
// app.listen(3000, "127.0.0.1", function () {
//
//     console.log("Server started on localhost:3000");
// });
//
// function to_db(tracks) {
//     console.log(`---- Tracks db - ${tracks}`);
//     mongoClient.connect(function (err, client) {
//
//         const db = client.db("tracks");
//         const collection = db.collection("tracks");
//
//         collection.insertMany(tracks, function (err, result) {
//             if (err) {
//                 return console.log(err);
//             }
//             console.log(result.ops);
//             client.close();
//         });
//     });
// }
//


// Requires

const express = require("express");
const morgan = require("morgan");  // request logger
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;

const app = express();  // main app

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
        response.send(result);
    });
});

app.get("/users", function (request, response) {
    get_info(request.query.username, request);
    response.redirect("/");
    // const collection = request.app.locals.collection;
    // const fs = require("fs");
    // let obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    // collection.drop(function(err){
    //     if (err) console.error(err);
    // });
    // collection.insertMany(obj, function (err, result) {
    //     if (err) return console.error(err);
    //     // console.log(result);
    // });
    // response.send("<a href='/tracks'>Tracks</a>")
});

function get_info(username, req) {
    // parse music information
    const request = require("request"),
        cheerio = require("cheerio"),
        url = `https://www.last.fm/user/${username}/library/tracks`;
    const fs = require('fs');
    request(url, function (error, response, body) {
        let tracks = [];
        if (!error) {
            var $ = cheerio.load(body),
                Obj = $("#top-tracks-section > table > tbody > tr");
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
            collection.insertOne({username: {[username]: tracks}}, function (err) {
                if (err) console.error(err);
            });
            // console.log(`---- Parse tracks\n${tracks}`);
            // write to json
            // fs.writeFile('data.json', JSON.stringify(tracks, null, 4), function (err) {
            //     if (err) {
            //         console.error(err);
            //     } else {
            //         console.log('Data Saved to data.json file');
            //     }
            // });

        } else {
            console.error("An error occurred: " + error);
        }
    });
}




