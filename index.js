//import Express into the package
const express = require ('express'),
    morgan = require ('morgan'),
    fs = require ('fs'), //import built in node modules fs and path
    path = require ('path');

const app = express();
//create a write stram (in append mode)
// a 'log.txt' file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

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

app.get("/movies", (req, res)=>{
    res.json(topMovies);
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
