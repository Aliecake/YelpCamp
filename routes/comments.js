const express = require('express'),
    router = express.Router({mergeParams: true}),
    methodOverride = require('method-override'),
    Comment = require('../models/comments'),
    middleware = require('../middleware');

//====COMMENTS ROUTE====get

router.get('/new', middleware.loginCheck, (req, res) => {
    const id = req.params.id;
    Campground.findById(id, (err, camp) => {
        if(err || !camp) {
            middleware.errorHandling(req, res, err);
        } else {
            res.render('comments/new', {
                camp: camp
        });
        }
    });
});

//create comment POST route
router.post('/', middleware.loginCheck, (req, res) => {
    //==========SANITIZE=========//
    const id = req.params.id;
    Campground.findById(id, (err, camp) => {
        if(err || !camp){
            middleware.errorHandling(req, res, err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err || !comment) {
                    middleware.errorHandling(req, res, err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                    res.redirect(`/camps/${id}`);
                }
            });
        }
    });
});

router.get('/:comment_id/edit', middleware.loginCheck, (req, res) => {
    const id = req.params.id;
    const commentId = req.params.comment_id;
    //campground find by id or comment find by id
    Comment.findById(commentId, (err, comment) => {
        if (err || !comment){
            middleware.errorHandling(req, res, err);
        } else {
            res.render(`comments/edit`, {
                comment: comment,
                camp_id: id
            });
        }
    });
});

router.put('/:comment_id', middleware.loginCheck, (req, res) => {
    const id = req.params.id;
    const commentId = req.params.comment_id;
    const updateComment = {
        text: req.body.comment.text,
        created: Date.now()
    };
    Comment.findById(commentId, (err, comment) => {
        if(err || !comment){
            middleware.errorHandling(req, res, err);
        } else {
            if(comment.author.id.equals(req.user._id)) {
                middleware.authorizedUpdate(req, res, commentId, Comment, updateComment, id);
            } else {
                req.flash('error', `You are not authorized to update that. Only the original author can do that`);
                res.redirect(`/camps/${id}?authorized=false`);
            }
        }
    });
});

router.delete('/:comment_id', middleware.loginCheck, (req, res) => {
    const id = req.params.id;
    const commentId = req.params.comment_id;
    Comment.findById(commentId, (err, comment) => {
        if (err || !comment){
            middleware.errorHandling(req, res, err);
        } else {
            //if comment author id === req.user.id
            if(comment.author.id.equals(req.user._id)) {
                middleware.authorizedDelete(req, res, commentId, Comment, id);
            } else {
                req.flash('error', `You are not authorized to delete that. Only the original author can do that`);
                res.redirect(`/camps/${id}?authorized=false`);
            }
        }
    });
});

module.exports = router;