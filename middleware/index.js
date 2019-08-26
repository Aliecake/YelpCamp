const Comment = require('../models/comments'),
    Campground = require('../models/campgrounds');

const middlewareObj = {};

middlewareObj.authorizedUpdate = (req, res, id, label, body, redirect ='') => {
    console.log(label);
    label.findByIdAndUpdate(id,  body, (err) => {
        if (err) {
            console.log(`You are authorized to do that, but there was an error`, err);
        } else {
            req.flash('success', 'Updated');
            res.redirect(`/camps/${redirect}`);
        }
    });
};

middlewareObj.authorizedDelete = (req, res, id, label, redirect = '') => {
    label.findByIdAndDelete(id, (err) => {
        if (err){
            res.send(`You have proper authorization, but there was an error`, err);
        } else {
            req.flash('success', 'Removed');
            res.redirect(`/camps/${redirect}`);
        }
    });
};

middlewareObj.loginCheck = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error', `You must be logged in to do that! Please <a href="/login">Login</a> or <a href="register">Register</a>.`);
        res.redirect('/login');
    }
};

module.exports = middlewareObj;