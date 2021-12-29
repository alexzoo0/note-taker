// Dependencies
const express = require ("express");
const fs = require ("fs");
const path = require ("path");
const database = require("./db/db.json");

//setting the express app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// begin with index.html page.
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("/notes", function (req, res){
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// routes
app.route("/api/notes")
.get(function (req, res){
    res.json(database);
})

.post(function (req, res){
    var paths = path.join(__dirname, "/db/db.json");
    var newFile = req.body;
    var ids = 100;

    for (var i = 0; i< database.length; i++) {
        var oneNote = database[i];
        
        if (oneNote.id > ids){
            ids = oneNote.id;
        }
    }
    newFile.id = ids + 1;
    database.push(newFile);

    fs.writeFile(paths, JSON.stringify(database), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("sucessfully saved!")
    });
    res.json(newFile);
});

// delete option

app.delete("/api/notes/:id", function (req, res){
    var paths = path.join(__dirname, "/db/db.json");

    for (var i = 0; i < database.length; i++) {

        if (database[i].id == req.params.id) {
            database.splice(i, 1);
            break;
        }
    }
    
    fs.writeFileSync(paths, JSON.stringify(database), function (err) {
        if (err){
            return console.log(err);
        }
        else{
            console.log("note deleted.");
        }
    });
    res.json(database);
});

app.listen(PORT, function(newFile){
    console.log("your PORT " + PORT + " is ready.");
});







