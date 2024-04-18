const express = require('express');
const pokemon = require('./backend/pokemon.api.cjs');
const users = require('./backend/user.api.cjs')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const path = require('path')

const app = express();


const mongoDBEndpoint = 'mongodb+srv://xiyuwanbjtu:h1S5awMqeJrcDOH8@5610cluster.ux9bey0.mongodb.net/?retryWrites=true&w=majority&appName=5610Cluster'
mongoose.connect(mongoDBEndpoint, {
    useNewUrlParser: true,
})

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/pokemon', pokemon);
app.use('/api/users', users);

// app.get('/', function(req, res) {
//     res.send("This is the FIRST GET request")
// });

// app.get('/', function(request, response) {
//     response.send("This is SECOND GET request");
// })

// app.put('/', function(request, response) {
//     response.send("This is a PUT request")
// })


let frontend_dir = path.join(__dirname, 'dist')

app.use(express.static(frontend_dir));
app.get('*', function (req, res) {
    console.log("received request");
    res.sendFile(path.join(frontend_dir, "index.html"));
});

app.listen(process.env.PORT || 8000, function() {
    console.log("Starting app now...")
})