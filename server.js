var express = require("express");
var logger = require("morgan");
var mongojs = require("mongojs");
var exphbs = require("express-handlebars");

var axios = require("axios");
var cheerio = require("cheerio");

// var db = require("./models");
var PORT = 3000;

var app = express();

// Database configuration
var databaseUrl = "newsScrape";
var collections = ["scrapeData", "note"];


var db = mongojs(databaseUrl, collections);

// Middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
// Set handlebars as the default templating engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

db.on("error", function (error) {
    console.log("Database Error:", error);
})


// Routes
app.get("/", function (req, res) {
    db.scrapeData.find({}, function (error, found) {
        if (error) {
            console.log(error)
        } else {
            res.render("index", { articles: found })
        }
    })
})

app.get("/scrape", function (req, res) {
    axios.get("https://www.heraldonline.com/news/local/community/fort-mill-times/").then(function (response) {
        var $ = cheerio.load(response.data);

        $("article.local").each(function (i, element) {
            var result = {};

            result.link = $(this).children(".teaser").children(".title").children("a").attr("href");

            result.title = $(this).children(".teaser").children(".title").children("a").text();
            result.summary = $(this).children(".teaser").children(".summary").text();
            console.log(result);

            if (result.title && result.link && result.summary) {
                db.scrapeData.insert({
                    title: result.title,
                    link: result.link,
                    summary: result.summary,
                    note: "none"
                },
                    function (err, inserted) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(inserted);
                        }
                    }
                )

            }
            res.send("Scrape Complete");
        });
    });
});

app.post("/save", function(req, res) {
db.note.insert(req.body, function(error, saved) {
    if (error) {
        console.log(error);
    }
    else {
        db.scrapeData.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { note: req.body } }
         )    
    }
})
})

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
