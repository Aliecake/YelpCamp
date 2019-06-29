const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require('./models/campgrounds'),
    Comment = require('./models/comments'),
    SeedDB = require('./seeds');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost/yelp_camp_db', {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

SeedDB();

app.get('/', (req, res) => {
    res.render('landing');
});

//INDEX - Show all
app.get('/camps', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if(err) {
            console.log("error populating campgrounds from mongodb", err);
        } else {
            res.render('camps/index', {campgrounds: campgrounds});
        }
    });
});

//CREATE - Add a new camp
app.post('/camps', (req, res) => {
    Campground.create({
        name: req.body.name,
        img: req.body.image,
        desc: req.body.description
    }, (err, camp) => {
        if(err) {
            console.log("Error posting to DB", err);
        } else {
            console.log("Added to DB", camp);
        }
    });
    res.redirect('/camps');
});

//NEW - Show form
app.get('/camps/new', (req, res) => {
    res.render('camps/new');
});

//SHOW further info on individual camps
app.get('/camps/:id', (req, res) => {
    const id = req.params.id;
    Campground.findById(id).populate('comments').exec((err, camp) => {
        if(err) {
            console.log(err);
        } else {
            res.render('camps/show', {camp: camp});
        }
    });

});

//====COMMENTS ROUTE====get

app.get('/camps/:id/comments/new', (req, res) => {
    const id = req.params.id;
    Campground.findById(id, (err, camp) => {
        if(err) {
            res.send('Error finding that camp, press back');
        } else {
            res.render('comments/new', {camp: camp});
        }
    });
});

//create comment POST route
app.post('/camps/:id/comments', (req, res) => {
    const id = req.params.id;
    Campground.findById(id, (err, camp) => {
        if(err){
            console.log(err);
        } else {
            Comment.create({
                text: req.body.comment.text,
                author: req.body.comment.author,
            }, (err, camp) => {
                if(err) {
                    console.log("Error posting comment to DB", err);
                } else {
                    console.log("Added comment to DB", camp);
                }
            });
            //connect comment to campground
            res.redirect(`/camps/${id}`);
        }
    });
});

app.get('*', (req, res) => {
    res.send('404 not found, press back');
});
app.listen(3000, () => {
    console.log('listening on port 3000');
});