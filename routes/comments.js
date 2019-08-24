const express = require('express'),
    router = express.Router({mergeParams: true}),
    methodOverride = require('method-override'),
    Comment = require('../models/comments');

//====COMMENTS ROUTE====get

router.get('/new', loginCheck, (req, res) => {
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
router.post('/', loginCheck, (req, res) => {
    //==========SANITIZE=========//
    const id = req.params.id;
    Campground.findById(id, (err, camp) => {
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    console.log("Error posting comment to DB", err);
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

//comment edit /camps/:id/comments/:diffid/edit get to show form
router.get('/:comment_id/edit', (req, res) => {
    const id = req.params.id;
    const commentId = req.params.comment_id;
    //campground find by id or comment find by id
    Comment.findById(commentId, (err, comment) => {
        console.log(comment);
        res.render(`comments/edit`, {
            comment: comment,
            camp: id
        });
    });
});
router.put('/:comment_id', (req, res) => {
    const id = req.params.id;
    const commentId = req.params.comment_id;
    console.log(req.params.body);
    const updateComment = {
        text: req.params.body.text,
        created: req.params.body.created,
    };
    //need camp ID still...
    Comment.findByIdAndUpdate(commentId, updateComment, (err, comment) => {
        if (err) {
            console.log(`err updating comment`, err);
        } else {
            console.log(comment)
            res.render(`camps/${id}`, {
                comment: comment
            });
        }
    });
});
//comment update comment/id/ put to put new comments
//comment delete comment/id/delete

function loginCheck(req, res, next){

    if(req.isAuthenticated()){
        return next();
    } else {
        const loginReq = `ERROR: You must be logged in to do that!.`;
        res.render('login', {
            loginReq: loginReq
        });
    }
}

module.exports = router;