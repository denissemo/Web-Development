// const osmosis = require("osmosis");
// const fs = require('fs');
// let savedData = [];
// osmosis
//     .get('https://www.last.fm/user/denissemo/library/tracks')
//     // .paginate('.pagination-list>li>a@href')
//     .find('#top-tracks-section > table')
//     // .follow("tbody > tr")
//     // .find("td.chartlist-name")
//     .set(
//         {
//             "artist": "tbody > tr > td.chartlist-name > span > span.chartlist-artists > a",
//             "title": "tbody > tr > td.chartlist-name > span > a"
//         }
//     )
//     // .set(
//     //     {
//     //         "artist": "span > span.chartlist-artists > a",
//     //         "title": "span > a"
//     //     }
//     // )
//     .log(console.log)
//     .data(function (data) {
//         console.log(data);
//         savedData.push(data);
//     })
// .done(function () {
//     fs.writeFile('data.json', JSON.stringify(savedData, null, 4), function (err) {
//         if (err) console.error(err);
//         else console.log('Data Saved to data.json file');
//     })
// });

const request = require("request"),
    cheerio = require("cheerio"),
    url = "https://www.last.fm/user/denissemo/library/tracks";
const fs = require('fs');

request(url, function (error, response, body) {
    var tracks = [];
    if (!error) {
        var $ = cheerio.load(body),
            Obj = $("#top-tracks-section > table > tbody > tr");
        for (var i = 0; i < $("table.chartlist tbody tr").length; i++) {
            var track = $(Obj.find("td.chartlist-name > span > a")[0]).attr('title');
            tracks.push({"artist": track.substring(0, track.indexOf("—")-1), "title": track.substring(track.indexOf("—")+2)})
            Obj = Obj.next();
        }
        console.log(tracks);
        fs.writeFile('data.json', JSON.stringify(tracks, null, 4), function (err) {
            if (err) console.error(err);
            else console.log('Data Saved to data.json file');
        })

    } else {
        console.log("Произошла ошибка: " + error);
    }
});