const express = require('express'),
    router = express.Router({mergeParams: true});
    methodOverride = require('method-override'),
    Campground = require('../models/campgrounds'),
    middleware = require('../middleware');

//INDEX - Show all
router.get('/', (req, res) => {
    Campground.find({}, (err, camps) => {
        if(err || !camps) {
            middleware.errorHandling(req, res, err);
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
        price: req.body.price,
        desc: req.body.description,
        author: {
            username: req.user.username,
            id: req.user._id
        }
    }, (err, camp) => {
        if(err || !camp) {
            middleware.errorHandling(req, res, err);
        } else {
            req.flash('success', `${camp.name} added to YelpCamp.`);
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
        if(err || !camp) {
            middleware.errorHandling(req, res, err);
        } else {
            res.status(200).render('camps/show', {
                camp: camp
            });
        }
    });

});

//EDIT individual camp
router.get('/:id/edit', middleware.loginCheck, (req, res) => {
    const id = req.params.id;
    Campground.findById(id, (err, camp) => {
        if (err || !camp) {
            middleware.errorHandling(req, res, err);
        } else {
            res.render(`camps/edit`, {
                camp: camp
            });
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
        if(err || updatedCamp){
            middleware.errorHandling(req, res, err);
        } else {
            req.flash('success', `${updateBody.name} successfully updated.`);
            res.redirect(`/camps/${id}`);
        }
    });
});

router.delete('/:id', middleware.loginCheck, (req, res) => {
    const id = req.params.id;
    Campground.findById(id, (err, camp) => {
        if (err || !camp) {
            middleware.errorHandling(req, res, err);
        } else {
             //if user is created user then delete
           if (camp.author.id.equals(req.user._id)) {
               middleware.authorizedDelete(req, res, id, Campground);
           } else {
               req.flash('error', `You are not authorized to do that. Only the original author can delete a camp.`);
               res.redirect(`/camps/${id}`);
           }
        }
    });
});

module.exports = router;