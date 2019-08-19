const express = require('express'),
    router = express.Router({mergeParams: true});
    Campground = require('../models/campgrounds');
//INDEX - Show all
router.get('/', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if(err) {
            console.log("error populating campgrounds from mongodb", err);
        } else {
            res.render('camps/index', {campgrounds: campgrounds});
        }
    });
});

//CREATE - Add a new camp
router.post('/', (req, res) => {
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
router.get('/new', (req, res) => {
    res.render('camps/new');
});

//SHOW further info on individual camps
router.get('/:id', (req, res) => {
    const id = req.params.id;
    Campground.findById(id).populate('comments').exec((err, camp) => {
        if(err) {
            console.log(err);
        } else {
            res.status(200).render('camps/show', {
                camp: camp
            });
        }
    });

});

module.exports = router;