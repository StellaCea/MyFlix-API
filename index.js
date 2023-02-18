//import Express into the package
const express = require ('express'),
    morgan = require ('morgan'),
    fs = require ('fs'), //import built in node modules fs and path
    path = require ('path'),
    bodyParser = require("body-parser"),
    uuid = require("uuid");

const app = express();

app.use(bodyParser.json()); //middleware
//create a write stram (in append mode)
// a 'log.txt' file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

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
        "ImageUrl": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTYGx6w4wW7xmC8h_UdhyzyxhOV4QZofI0lrgZ7JgMkCyqGG5M_",
        "Featured": false
    },
    {
        "Title": "The Mother",

        "Description" : "While fleeing from dangerous assailants, an assassin comes out of hiding to protect her daughter she left earlier in life.",

        "Genre":{
            "Name": "Thriller",
            "Description": "A thriller novel devotes most of its focus to suspense, dread, and the fear of a future crime—instead of one that's already happened"
        },
        "Director": {
            "Name": "Niki Caro",
            "Bio": "Niki Caro is a New Zealand film director and screenwriter, born in 1967. Caro was born in Wellington, the capital city of New Zealand. She was educated first at the Kadimah College in Auckland, and then the Diocesan School for Girls in Auckland. The School is a private girls' school, and ranks among the top-achieving schools in New Zealand.",
            "Birth": 1966.0
        },
        "ImageUrl": "https://m.media-amazon.com/images/M/MV5BMjRjYmJmODQtNzY3Mi00MTQ4LTk0Y2ItYmY4NzE1Mzc5YmI5XkEyXkFqcGdeQXVyMjg3NTU2Mzk@._V1_.jpg",
        "Featured": false
    },
    {
        "Title": "Don\'t Worry Darling",

        "Description" : "A 1950s housewife living with her husband in a utopian experimental community begins to worry that his glamorous company could be hiding disturbing secrets.",

        "Genre":{
            "Name": "Thriller/Mystery",
            "Description": "A thriller novel devotes most of its focus to suspense, dread, and the fear of a future crime—instead of one that's already happened"
        },
        "Director": {
            "Name": "Olivia Wilde",
            "Bio": "Olivia Jane Cockburn (born March 10, 1984), known professionally as Olivia Wilde, is an American actress and filmmaker. She played Remy Thirteen Hadley on the medical drama television series House (2007–2012), and has appeared in the films Tron: Legacy (2010), Cowboys & Aliens (2011), The Incredible Burt Wonderstone (2013), and The Lazarus Effect (2015). Wilde made her Broadway debut in 2017, playing Julia in 1984. In 2019, she directed her first film, the teen comedy Booksmart, for which she won the Independent Spirit Award for Best First Feature. Wilde's second feature as director, Don't Worry Darling, was released in 2022.",
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
            "Description": "A thriller novel devotes most of its focus to suspense, dread, and the fear of a future crime—instead of one that's already happened"
        },
        "Director": {
            "Name": "Mark Mylod",
            "Bio": "Mark Mylod is a British television and film director and executive producer. He is known for his work on the television series Succession and Shameless, as well as for directing the horror-comedy film The Menu.",
            "Birth": 1965.0
        },
        "ImageUrl": "https://m.media-amazon.com/images/M/MV5BMzdjNjI5MmYtODhiNS00NTcyLWEzZmUtYzVmODM5YzExNDE3XkEyXkFqcGdeQXVyMTAyMjQ3NzQ1._V1_.jpg",
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

//CREATE - add new user
app.post("/users", (req, res) => {
    const newUser = req.body;

    if (newUser.name) { //checks if user has a name
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else{
        res.status(400).send("Users need names");
    }
})

//UPDATE - allow users to update theit info (name)
app.put("/users/:id", (req, res) => {
    const {id} = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id); //2 equal signs cos number

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send("No such user");
    }
})

//CREATE - allow users add fav movies (string that it happened)
app.post("/users/:id/:movieTitle", (req, res) => {
    const {id, movieTitle} = req.params;

    let user = users.find(user => user.id == id); 

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
        res.status(400).send("No such user");
    }
})

//DELETE - remove a movie from the list
app.delete("/users/:id/:movieTitle", (req, res) => {
    const {id, movieTitle} = req.params;

    let user = users.find(user => user.id == id); 

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);;
    } else {
        res.status(400).send("No such user");
    }
})

//DELETE - allow existing user to deregister
app.delete("/users/:id", (req, res) => {
    const {id} = req.params;

    let user = users.find(user => user.id == id); 

    if (user) {
        users = users.filter(user => user.id != id);
        res.status(200).send(`user ${id} has been deleted!`);;
    } else {
        res.status(400).send("No such user");
    }
})


//READ return a list of all movies
app.get("/movies", (req, res)=>{
    res.status(200).json(topMovies);
});

//READ return movie by title
app.get("/movies/:title", (req, res)=>{
    const title = req.params.title;
    const movie = topMovies.find( movie => movie.Title === title );

    if (movie) {
        res.status(200).json(movie);
    } else{
        res.status(400).send ("No such movie");
    }
});

//READ return movies by genre
app.get("/movies/genre/:genreName", (req, res)=>{
    const {genreName}= req.params;
    const genre = topMovies.find(movie => movie.Genre.Name === genreName).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else{
        res.status(400).send ("No such genre");
    }
});

//READ return data about director by name
app.get("/movies/directors/:directorName", (req, res)=>{
    const {directorName}= req.params;
    const director = topMovies.find(movie => movie.Director.Name === directorName).Director;

    if (director) {
        res.status(200).json(director);
    } else{
        res.status(400).send ("No such director");
    }
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
