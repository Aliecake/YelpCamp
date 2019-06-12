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
    img: String
});
const Campground = mongoose.model("Campground", campsSchema);

// Campground.create(
//     {
//         name: 'fitch', img: 'https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg'
//     }, (err, camp) =>{
//         if(err){
//             console.log(err);
//         } else {
//             console.log(camp, "added")
//         }
//     }
// );

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/camps', (req, res) => {

    //get all campgrounds from db
    Campground.find({}, (err, campgrounds) => {
        if(err) {
            console.log("error populating camps from mongodb", err)
        } else {
            res.render('camps', {campgrounds: campgrounds})
        }
    });
});

app.post('/camps', (req, res) => {
    console.log(req.body)
    const name = req.body.name;
    const img = req.body.image
    console.log(req.body)
    const newCampground = {name: name, img: img};

    //switch to mongo
    campgrounds.push(newCampground);
    console.log(campgrounds)
    res.redirect('/camps');
});
app.get('/camps/new', (req, res) => {
    res.render('newCamp.ejs');
});

app.get('*', (req, res) => {
    res.send('404 not found, press back')
});
app.listen(3000, () => {
    console.log('listening on port 3000');
});