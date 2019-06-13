const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect('mongodb://localhost/yelp_camp_db', {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const campsSchema = new mongoose.Schema ({
    name: String,
    img: String,
    desc: String
});
const Campground = mongoose.model("Campground", campsSchema);

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/camps', (req, res) => { 
    Campground.find({}, (err, campgrounds) => {
        if(err) {
            console.log("error populating campgrounds from mongodb", err)
        } else {
            res.render('camps', {campgrounds: campgrounds})
        }
    });
});

// Campground.create({
//     name: 'White Mountains',
//     img: 'https://farm8.staticflickr.com/7285/8737935921_47343b7a5d.jpg',
//     desc: 'Lots of great hiking and fishing. Potable water and grills available. It gets cold at night, bring enough firewood or warm sleeping bags.'
// }, (err, camp)=> {
//     if(err){
//         console.log("error")
//     } else {
//         console.log("New one added", camp)
//     }
// })

app.post('/camps', (req, res) => {
    Campground.create({
        name: req.body.name,
        img: req.body.image
    }, (err, camp) => {
        if(err) {
            console.log("Error posting to DB", err)
        } else {
            console.log("Added to DB", camp)
        }
    })
    res.redirect('/camps');
});

app.get('/camps/new', (req, res) => {
    res.render('newCamp.ejs');
});

//get request for /camps/:id to show further info on individual camps
app.get('/camps/:id', (req, res) => {
    res.send("This will be info about requested camp")
});

app.get('*', (req, res) => {
    res.send('404 not found, press back')
});
app.listen(3000, () => {
    console.log('listening on port 3000');
});