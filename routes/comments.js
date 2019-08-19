const express = require('express'),
    router = express.Router(),
    Comment = require('../models/comments');

//====COMMENTS ROUTE====get

router.get('/camps/:id/comments/new', loginCheck, (req, res) => {
    const id = req.params.id;
    Campground.findById(id, (err, camp) => {
        if(err) {
            res.send('Error finding that camp, press back');
        } else {
            res.render('comments/new', {
                camp: camp
        });
        }
    });
});

//create comment POST route
router.post('/camps/:id/comments', loginCheck, (req, res) => {
    const id = req.params.id;
    Campground.findById(id, (err, camp) => {
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    console.log("Error posting comment to DB", err);
                } else {
                    //connect camp to comment
                    camp.comments.push(comment);
                    camp.save();
                    res.redirect(`/camps/${id}`);
                }
            });
        }
    });
});

function loginCheck(req, res, next){

    if(req.isAuthenticated()){
        return next();
    } else {
        const loginReq = `ERROR: You must be logged in to post a comment.`;
        res.render('login', {
            loginReq: loginReq
        });
    }
}

module.exports = router;