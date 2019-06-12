const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
const campgrounds = [
    {'name': 'fitch', 'img': 'https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg'},
    {'name': 'rice moody','img': 'https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg'},
    {'name': 'fitch', 'img': 'https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg'},
    {'name': 'rice moody','img': 'https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg'},
    {'name': 'fitch', 'img': 'https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg'},
    {'name': 'rice moody','img': 'https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg'},
    {'name': 'fitch', 'img': 'https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg'},
    {'name': 'rice moody','img': 'https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg'}
];

mongoose.connect('mongodb://localhost/yelp_camp_db', {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const campsSchema = new mongoose.Schema ({
    name: String,
    img: String
});
const Campground = mongoose.model("Campground", campsSchema);

Campground.create(
    {
        name: 'fitch', img: 'https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg'
    }, (err, camp) =>{
        if(err){
            console.log(err);
        } else {
            console.log(camp, "added")
        }
    }
);

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/camps', (req, res) => {

    //switch to mongo
    res.render('camps', {campgrounds: campgrounds});
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