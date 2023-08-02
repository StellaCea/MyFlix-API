const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

//mongoose.connect('mongodb://localhost:27017/cfDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true});


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

const cors = require("cors"); 
//app.use(cors()); //sets the app to allow requests from all origins

//Only certain origins will be given access
let allowedOrigins = [
    'http://localhost:8080', 
    'http://testsite.com', 
    'http://localhost:1234', 
    'https://myflix-x.netlify.app', 
    'http://localhost:4200',
    'https://stellacea.github.io/myFlix-Angular-client', 
    'https://stellacea.github.io'
];

app.use(cors({
    origin: (origin, callback) => {
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){ //if the specific origin wasn't found on the list of allowed origins
            let message = "The Cors policy for this app doesn't allow access from origin: " + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

let auth = require("./auth")(app); //app makes sure Express is available in auth.js
const passport = require("passport");
require("./passport");

const {check, validationResult} = require("express-validator");

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

/**
 * READ movies from the Database
 * @name movies
 * @kind function
 * @async
 * @returns an array of all movies
 */

app.get("/movies", passport.authenticate('jwt',{session:false}), (req, res) => {
    Movies.find()
        .then((topMovies) => {
            res.status(200).json(topMovies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

/**
 * READ movies by title
 * @name movies/Title
 * @kind function
 * @async
 * @param {string} Title
 * @return the title of the movie
 */

app.get("/movies/:Title", passport.authenticate('jwt',{session:false}), (req, res)=>{
    Movies.findOne({Title: req.params.Title})
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

/**
 * READ gets a movie by its genre
 * @name movie/Genre/Name
 * @kind function
 * @async
 * @param {string} Name
 * @returns the name of the genre of a movie
 */

app.get("/movies/genre/:genreName", passport.authenticate('jwt',{session:false}), (req, res)=>{
    Movies.findOne({"Genre.Name": req.params.genreName})
        .then((movie) => {
            res.json(movie.Genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

/**
 * Get a director by name
 * @name movies/Directors/Name
 * @kind function
 * @async
 * @param {string} Name
 * @returns the name of the director of a movie
 */

app.get("/movies/directors/:directorName", passport.authenticate('jwt',{session:false}), (req, res)=>{
    Movies.findOne({"Director.Name": req.params.directorName})
        .then((movie)=> {
            res.json(movie.Director);
        })
        .catch((err)=> {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

/**
 * Allows new users to register
 * @name registerUser
 * @param {string} Username username
 * @param {string} Password password
 * @param {string} Email email
 * @param {date} Birthday birthday
 * @kind function
 */
app.post("/users",
    [
        check("Username", "Username is required").isLength({min:5}),
        check("Username", "Username contains non alphanumeric charasters - not allowed. ").isAlphanumeric(),
        check("Password", "Password is required").not().isEmpty(),
        check("Email", "Email does not appear to be valid").isEmail()
    ],(req, res) => {

        //check the validation object for errors
        let errors = validationResult(req); //checks that the fields contain smth as it's required

        if(!errors.isEmpty()){
            return res.status(422).json({errors: errors.array()});
        }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({Username: req.body.Username}) //checks if user exists
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + "already exists");
            } else {
                Users
                    .create({
                        Username:req.body.Username,
                        Password: hashedPassword,
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

/**
 * Allow a user to update their info
 * @name updatedUser
 * @param {string} Username username
 * @param {string} Password password
 * @param {string} Email email
 * @param {date} Birthday birthday
 * @kind function
 * @requires passport
 */

app.put("/users/:Username", passport.authenticate('jwt',{session:false}), (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username}, {$set: 
        {
            Username: req.body.Username,
            Name: req.body.Name,
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

/**
 * Allows a user to add a movie to the array of favorite movies
 * @name addFavoriteMovie
 * @param {string} Username username
 * @param {string} MovieID, movie ID
 * @kind function
 * @returns a movie id from the user's favorite movies
 */

app.post("/users/:Username/movies/:MovieID", passport.authenticate('jwt',{session:false}), (req, res) => {
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
/**
 * Deletes a favorite movie from the array of favorite movies
 * @name deleteFavoriteMovie
 * @param {string} username
 * @param {string} MovieID
 * @returns deleted movie id from the user's favorite movies array
 */
app.delete("/users/:Username/movies/:MovieID", passport.authenticate('jwt',{session:false}), (req, res) => {
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

/**
 * Deletes user data from the DB by username
 * @name users/Username
 * @param {string} Username
 * @returns deleted user from the DB
 */
app.delete("/users/:Username", passport.authenticate('jwt',{session:false}), (req, res) => {
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

/**
 * Gets all the users from the DB
 * @name users
 * @kind function
 * @returns an array of users
 */
app.get("/users", passport.authenticate('jwt',{session:false}), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch ((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

/**
 * Gets a user by username
 * @name users/Username
 * @kind function
 * @param {string} Username
 * @returns a user by username
 */
app.get("/users/:Username", passport.authenticate('jwt',{session:false}), (req, res) => {
    Users.findOne({Username: req.params.Username})
        .then ((user) => {
            res.json(user);
        })
        .catch ((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

/**
 * Allows user to deregister (deletes by id)
 * @param {string} id
 * @kind function
 * @returns deletes user by id
 */

app.delete("/users/:id", passport.authenticate('jwt',{session:false}), (req, res) => {
    Users.findByIdAndRemove({_id: req.params.id})
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
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0",() => {
    console.log("Listening on Port " + port);
})
