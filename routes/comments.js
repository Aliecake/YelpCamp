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
        if (err){
            res.send(`error trying to find that comment`);
        } else {
            res.render(`comments/edit`, {
                comment: comment,
                camp_id: id
            });
        }
    });
});

router.put('/:comment_id', (req, res) => {
    const commentId = req.params.comment_id;
    const updateComment = {
        text: req.body.comment.text,
        created: Date.now()
    };
    Comment.findByIdAndUpdate(commentId, updateComment, (err, comment) => {
        if (err) {
            console.log(`err updating comment`, err);
        } else {
            res.redirect(`/camps/${req.params.id}`);
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