const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/cfDB', {useNewUrlParser: true, useUnifiedTopology: true});

//import Express into the package
const express = require ('express'),
    morgan = require ('morgan'),
    fs = require ('fs'), //import built in node modules fs and path
    path = require ('path'),
    bodyParser = require("body-parser"),
    uuid = require("uuid");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json()); //middleware
//create a write stram (in append mode)
// a 'log.txt' file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

let auth = require("./auth")(app); //app makes sure Express is available in auth.js
const passport = require("passport");
require("./passport");

let users = [
    {
        id: 1,
        name: "Ashley",
        favoriteMovies: ["The Mother"]
    },
    {
        id: 2,
        name: "Joseph",
        favoriteMovies: []
    }
]

let topMovies = [
    {
        "Title": "Harry Potter and the Sorcerer\'s stone",
        "Description": "An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world.",
        "Genre":{
            "Name": "Fantasy",
            "Description": "Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds."
        },
        "Director": {
            "Name": "Chris Columbus",
            "Bio": "Chris Joseph Columbus (born September 10, 1958) is an American filmmaker. Born in Spangler, Pennsylvania, Columbus studied film at Tisch School of the Arts where he developed an interest in filmmaking. After writing screenplays for several teen comedies in the mid-1980s, he made his directorial debut with a teen adventure, Adventures in Babysitting (1987). Columbus gained recognition soon after with the highly successful Christmas comedy Home Alone (1990) and its sequel Home Alone 2: Lost in New York (1992).",
            "Birth": 1958.0
        },
        "ImageUrl": "https://m.media-amazon.com/images/M/MV5BNmQ0ODBhMjUtNDRhOC00MGQzLTk5MTAtZDliODg5NmU5MjZhXkEyXkFqcGdeQXVyNDUyOTg3Njg@._V1_.jpg",
        "Featured": false
    },
    {
        "Title": "The Mother",

        "Description" : "While fleeing from dangerous assailants, an assassin comes out of hiding to protect her daughter she left earlier in life.",

        "Genre":{
            "Name": "Thriller",
            "Description": "A thriller novel devotes most of its focus to suspense, dread, and the fear of a future crime—instead of one that\'s already happened."
        },
        "Director": {
            "Name": "Niki Caro",
            "Bio": "Niki Caro is a New Zealand film director and screenwriter, born in 1967, in Wellington, the capital city of New Zealand. She was educated first at the Kadimah College in Auckland, and then the Diocesan School for Girls in Auckland. The School is a private girls\' school, and ranks among the top-achieving schools in New Zealand.",
            "Birth": 1966.0
        },
        "ImageUrl": "https://m.media-amazon.com/images/M/MV5BMjRjYmJmODQtNzY3Mi00MTQ4LTk0Y2ItYmY4NzE1Mzc5YmI5XkEyXkFqcGdeQXVyMjg3NTU2Mzk@._V1_.jpg",
        "Featured": false
    },
    {
        "Title": "Don\'t Worry Darling",

        "Description" : "A 1950s housewife living with her husband in a utopian experimental community begins to worry that his glamorous company could be hiding disturbing secrets.",

        "Genre":{
            "Name": "Mystery",
            "Description": "A mystery film is a genre of film that revolves around the solution of a problem or a crime."
        },
        "Director": {
            "Name": "Olivia Wilde",
            "Bio": "Olivia Jane Cockburn (born March 10, 1984)is an American actress and filmmaker. She played Remy Thirteen Hadley on the medical drama television series House (2007–2012), and has appeared in the films Tron: Legacy (2010), Cowboys & Aliens (2011), The Incredible Burt Wonderstone (2013), and The Lazarus Effect (2015). Wilde made her Broadway debut in 2017, playing Julia in 1984. In 2019, she directed her first film, the teen comedy Booksmart, for which she won the Independent Spirit Award for Best First Feature. Wilde\'s second feature as director, Don\'t Worry Darling, was released in 2022.",
            "Birth": 1984.0
        },
        "ImageUrl": "https://upload.wikimedia.org/wikipedia/en/4/4c/Don't_Worry_Darling_Poster_2.jpg",
        "Featured": true
    },
    {
        "Title": "Watcher",

        "Description" : "A young American woman moves with her husband to Bucharest, and begins to suspect that a stranger who watches her from the apartment building across the street may be a local serial killer decapitating women.",

        "Genre":{
            "Name": "Horror",
            "Description": "Horror is a genre of literature, film, and television that is meant to scare, startle, shock, and even repulse audiences."
        },
        "Director": {
            "Name": "Chloe Okuno",
            "Bio": "Chloe Okuno was born on August 1, 1987 in Los Angeles, California, USA. She is a director and writer, known for Tuls (2014).",
            "Birth": 1987.0
        },
        "ImageUrl": "https://m.media-amazon.com/images/M/MV5BMTNkNjU4OGYtODM3NS00NzM1LWFkZWItZTExNzdjYTAwMmRlXkEyXkFqcGdeQXVyMTE1MzI2NzIz._V1_FMjpg_UX1000_.jpg",
        "Featured": false
    },
    {
        "Title": "The Menu",

        "Description" : "A young couple travels to a remote island to eat at an exclusive restaurant where the chef has prepared a lavish menu, with some shocking surprises.",

        "Genre":{
            "Name": "Thriller",
            "Description": "A thriller novel devotes most of its focus to suspense, dread, and the fear of a future crime—instead of one that\'s already happened"
        },
        "Director": {
            "Name": "Mark Mylod",
            "Bio": "Mark Mylod is a British television and film director and executive producer. He is known for his work on the television series Succession and Shameless, as well as for directing the horror-comedy film The Menu.",
            "Birth": 1965.0
        },
        "ImageUrl": "https://m.media-amazon.com/images/M/MV5BMzdjNjI5MmYtODhiNS00NTcyLWEzZmUtYzVmODM5YzExNDE3XkEyXkFqcGdeQXVyMTAyMjQ3NzQ1._V1_.jpg",
        "Featured": false
    },
    {
        "Title": "The Lost City",

        "Description" : "A reclusive romance novelist on a book tour with her cover model gets swept up in a kidnapping attempt that lands them both in a cutthroat jungle adventure.",

        "Genre":{
            "Name": "Action",
            "Description": "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
        },
        "Director": {
            "Name": "Adam Nee",
            "Bio": "Adam Nee was born on 19 July 1981 in New Orleans, Louisiana, USA. He is an actor and writer, known for The Lost City (2022), Masters of the Universe (2024) and Band of Robbers (2015). He was previously married to Allison Miller.",
            "Birth": 1981.0
        },
        "ImageUrl": "https://m.media-amazon.com/images/M/MV5BMmIwYzFhODAtY2I1YS00ZDdmLTkyYWQtZjI5NDIwMDc2MjEyXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
        "Featured": false
    },
    {
        "Title": "Spirited",

        "Description" : "A musical version of Charles Dickens\'s story of a miserly misanthrope who is taken on a magical journey.",

        "Genre":{
            "Name": "Comedy",
            "Description": "A comedy film is a category of film which emphasizes humor. These films are designed to make the audience laugh through the amusement."
        },
        "Director": {
            "Name": "Sean Anders",
            "Bio": "Sean Anders (born June 19, 1969) is an American film director and screenwriter. He co-wrote and directed the 2005 film Never Been Thawed, the 2008 film Sex Drive, the 2014 film Horrible Bosses 2, the 2015 film Daddy\'s Home, the 2017 sequel Daddy\'s Home 2, the 2018 film Instant Family based on his own history, and the 2022 holiday film Spirited. He is the brother of actress Andrea Anders.",
            "Birth": 1969.0
        },
        "ImageUrl": "https://m.media-amazon.com/images/M/MV5BY2RlZGFmYjAtNGZiMi00YjQ5LWE0ZmQtZmIyM2VmMjRhMTJlXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX1000_.jpg",
        "Featured": false
    },
    {
        "Title": "Mulan",

        "Description" : "A young Chinese maiden disguises herself as a male warrior in order to save her father.",

        "Genre":{
            "Name": "Action",
            "Description": "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
        },
        "Director": {
            "Name": "Niki Caro",
            "Bio": "Niki Caro is a New Zealand film director and screenwriter, born in 1967, in Wellington, the capital city of New Zealand. She was educated first at the Kadimah College in Auckland, and then the Diocesan School for Girls in Auckland. The School is a private girls\' school, and ranks among the top-achieving schools in New Zealand.",
            "Birth": 1966.0
        },
        "ImageUrl": "https://upload.wikimedia.org/wikipedia/en/1/17/Mulan_%282020_film%29_poster.jpg",
        "Featured": false
    },
    {
        "Title": "Where the Crawdads Sing",

        "Description" : "A woman who raised herself in the marshes of the Deep South becomes a suspect in the murder of a man with whom she was once involved.",

        "Genre":{
            "Name": "Drama",
            "Description": "Drama Films are serious presentations or stories with settings or life situations that portray realistic characters in conflict with either themselves, others, or forces of nature. "
        },
        "Director": {
            "Name": "Olivia Newman",
            "Bio": "Olivia Newman is an American film director and screenwriter. She is best known for directing First Match (2018) and the 2022 feature adaptation of Where the Crawdads Sing. Olivia was born in Hoboken, New Jersey. She holds a B.A. in French and women's studies from Vassar College and an MFA in film from Columbia University. Her first short film, Blue-Eyed Mary was shown at the Portland Oregon Women's Film Festival in 2010",
            "Birth": 1979.0
        },
        "ImageUrl": "https://m.media-amazon.com/images/M/MV5BMTJmNGJmYTgtYjAxNy00YmMzLTk2YTYtMGIzMmUwNDMyMTY1XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX1000_.jpg",
        "Featured": false
    },
    {
        "Title": "Amsterdam",

        "Description" : "In the 1930s, three friends witness a murder, are framed for it, and uncover one of the most outrageous plots in American history.",

        "Genre":{
            "Name": "Comedy",
            "Description": "A comedy film is a category of film which emphasizes humor. These films are designed to make the audience laugh through the amusement."
        },
        "Director": {
            "Name": "David Russel",
            "Bio": "David Owen Russell is an American film writer, director, and producer, known for a cinema of intense, tragi-comedic characters whose love of life can surpass dark circumstances faced in very specific worlds. His films address such themes as mental illness as stigma or hope; invention of self and survival; the family home as nexus of love, hate, transgression, and strength; women of power and inspiration; beauty and comedy found in twisted humble circumstances; the meaning of violence, war, and greed; and the redemptive power of music above all.",
            "Birth": 1958.0
        },
        "ImageUrl": "https://m.media-amazon.com/images/M/MV5BNDQwNzE0ZTItYmZjMC00NjI3LWFlNzctNTExZDY2NWE0Zjc0XkEyXkFqcGdeQXVyMTA3MDk2NDg2._V1_.jpg",
        "Featured": false
    },
    {
        "Title": "American Hustle",

        "Description" : "A con man, Irving Rosenfeld, along with his seductive partner Sydney Prosser, is forced to work for a wild F.B.I. Agent, Richie DiMaso, who pushes them into a world of Jersey powerbrokers and the Mafia.",

        "Genre":{
            "Name": "Crime",
            "Description": "Crime film is a genre that revolves around the action of a criminal mastermind."
        },
        "Director": {
            "Name": "David Russel",
            "Bio": "David Owen Russell is an American film writer, director, and producer, known for a cinema of intense, tragi-comedic characters whose love of life can surpass dark circumstances faced in very specific worlds. His films address such themes as mental illness as stigma or hope; invention of self and survival; the family home as nexus of love, hate, transgression, and strength; women of power and inspiration; beauty and comedy found in twisted humble circumstances; the meaning of violence, war, and greed; and the redemptive power of music above all.",
            "Birth": 1958.0
        },
        "ImageUrl": "https://m.media-amazon.com/images/M/MV5BMmM4YzJjZGMtNjQxMy00NjdlLWJjYTItZWZkYzdhOTdhNzFiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        "Featured": false
    }
]

//use express static to serve doc.html
app.use(express.static('public'));

//setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

//GET requests 
app.get("/", (req, res) => {
    res.send("Welcome to myFlix movie app!");
});

app.get("/documentation", (req, res)=>{
    res.sendFile("public/documenation.html", {root:_dirname});
});

//READ return a list of all movies
app.get("/movies", passport.authenticate("jwt", {session: false}), (req, res) => {
    Movies.find()
        .then((topMovies) => {
            res.status(200).json(topMovies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

//READ return movie by title
app.get("/movies/:Title", passport.authenticate("jwt", {session: false}),(req, res)=>{
    Movies.findOne({Title: req.params.Title})
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

//READ return a movie by genre
app.get("/movies/genre/:genreName", passport.authenticate("jwt", {session: false}), (req, res)=>{
    Movies.findOne({"Genre.Name": req.params.genreName})
        .then((movie) => {
            res.json(movie.Genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

//READ return data about director by name
app.get("/movies/directors/:directorName", passport.authenticate("jwt", {session: false}),(req, res)=>{
    Movies.findOne({"Director.Name": req.params.directorName})
        .then((movie)=> {
            res.json(movie.Director);
        })
        .catch((err)=> {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

//CREATE - allow new users to register
app.post("/users", (req, res) => {
    Users.findOne({Username: req.body.Username}) //checks if user exists
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + "already exists");
            } else {
                Users
                    .create({
                        Username:req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) => {res.status(201).json(user) })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send("Error: " + error);
                })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
        });
});

//UPDATE User's info by username
app.put("/users/:Username", passport.authenticate("jwt", {session: false}), (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username}, {$set: 
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
    {new: true }, //makes sure that the updated doc is returned
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send("Error: " + err);
        } else{
            res.json(updatedUser);
        }
    });
});

//Add a movie to a user's list of favorites
app.post("/users/:Username/movies/:MovieID", passport.authenticate("jwt", {session: false}), (req, res) => {
    Users.findOneAndUpdate({Username:req.params.Username}, {
        $push: {FavoriteMovies: req.params.MovieID}
    },
    {new: true},
    (err, updatedUser) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error: " + err);
        } else {
            res.json(updatedUser);
        }
    });
});

//DELETE - remove a movie from the list
app.delete("/users/:Username/movies/:MovieID", passport.authenticate("jwt", {session: false}), (req, res) => {
    Users.findOneAndUpdate({Username:req.params.Username}, {
        $pull: {FavoriteMovies: req.params.MovieID}
    },
    {new: true},
    (err, updatedUser) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error: " + err);
        } else {
            res.json(updatedUser);
        }
    });
});

//DELETE - allow existing user to deregister
app.delete("/users/:Username", passport.authenticate("jwt", {session: false}), (req, res) => {
    Users.findOneAndRemove({Username: req.params.Username})
    .then((user)=> {
        if(!user) {
            res.status(400).send(req.params.Username + " was not found");
        } else {
            res.status(200).send(req.params.Username + "was deleted. ");
        }
    })
    .catch((err)=> {
            console.error(err);
            res.status(500).send("Error: " + err);
        });  
});

//Get all users
app.get("/users", passport.authenticate("jwt", {session: false}), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch ((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

//Get a user by username
app.get("/users/Username", passport.authenticate("jwt", {session: false}), (req, res) => {
    Users.findOne({Username: req.params.Username})
        .then ((user) => {
            res.json(user);
        })
        .catch ((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

//Delete a user by username
app.delete("/users/:Username", passport.authenticate("jwt", {session: false}), (req, res) => {
    Users.findByIdAndRemove({Username: req.params.Username})
        .then((user) => {
            if(!user) {
                res.status(400).send(req.params.Username + " was not found");
            } else {
                res.status(200).send(req.params.Username + " was deleted");
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});


//error handler
app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).send("Something is broken");
})


//listen for requests
app.listen(8080, ()=>{
    console.log("Your app is listening on port 8080.");
});
