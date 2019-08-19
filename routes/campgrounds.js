const express = require('express'),
    router = express.Router();
    Campground = require('../models/campgrounds');
//INDEX - Show all
router.get('/camps', (req, res) => {
    console.log(req.user)
    Campground.find({}, (err, campgrounds) => {
        if(err) {
            console.log("error populating campgrounds from mongodb", err);
        } else {
            res.render('camps/index', {campgrounds: campgrounds});
        }
    });
});

//CREATE - Add a new camp
router.post('/camps', (req, res) => {
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
router.get('/camps/new', (req, res) => {
    res.render('camps/new');
});

//SHOW further info on individual camps
router.get('/camps/:id', (req, res) => {
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