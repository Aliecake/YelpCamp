const express = require('express'),
    router = express.Router({mergeParams: true});
    methodOverride = require('method-override'),
    Campground = require('../models/campgrounds'),
    middleware = require('../middleware');

//INDEX - Show all
router.get('/', (req, res) => {
    Campground.find({}, (err, camps) => {
        if(err) {
            console.log("error populating campgrounds from mongodb", err);
        } else {
            res.render('camps/index', {
                camps: camps
            });
        }
    });
});

//CREATE - Add a new camp
//want to save author username and ID
router.post('/', middleware.loginCheck, (req, res) => {
    //==========SANITIZE=========//
    Campground.create({
        name: req.body.name,
        img: req.body.image,
        desc: req.body.description,
        author: {
            username: req.user.username,
            id: req.user._id
        }
    }, (err, camp) => {
        if(err) {
            res.send("Error posting to DB, press back and try again", err);
        } else {
            console.log("Added to DB", camp);
        }
    });
    res.redirect('/camps');
});

//NEW - Show form
router.get('/new', middleware.loginCheck, (req, res) => {
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
                camp: camp,
                query: req.url
            });
        }
    });

});

//EDIT individual camp
router.get('/:id/edit', middleware.loginCheck, (req, res) => {
    const id = req.params.id;
    Campground.findById(id, (err, camp) => {
        if (err) {
            res.send(`There was an error finding that Campground. Press back and try again`, err);
        } else {
            res.render(`camps/edit`, {camp: camp});
        }
    });
});
//UPDATE individual
router.put('/:id', middleware.loginCheck, (req, res) => {
    //==========SANITIZE=========//
    const id = req.params.id;
    const updateBody = {
        name:  req.body.name,
        img: req.body.image,
        desc: req.body.description
    };
    Campground.findByIdAndUpdate(id, updateBody, (err, updatedCamp) => {
        if(err){
            res.send(`There was an error updating Camp`, err);
        } else {
            res.redirect(`/camps/${id}`);
        }
    });
});

router.delete('/:id', middleware.loginCheck, (req, res) => {
    const id = req.params.id;
    Campground.findById(id, (err, camp) => {
        if (err) {
            res.send(`Unable to find that Campground, press back and try again`);
        } else {
             //if user is created user then delete
           if (camp.author.id.equals(req.user._id)) {
               middleware.authorizedDelete(res, id, Campground);
           } else {
               res.redirect(`/camps/${id}?authorized=false`);
           }
        }
    });
});

module.exports = router;