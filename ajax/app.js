const express = require("express");
const path = require("path");

const app = express();  // main app
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.listen(3000, function () {
    console.log("Server started on localhost:3000");
});

app.get("/", function (request, response) {
    response.render("index.hbs");
});

app.get("/send_to_server", function (request, response) {
    let inp = request.query.input;
    response.send(`Server send response with your text '${inp}'`);
});

app.get("/get_from_server", function (request, response) {
   response.send("Hello from server:)");
});
