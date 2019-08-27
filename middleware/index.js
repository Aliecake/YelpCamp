const Comment = require('../models/comments'),
    Campground = require('../models/campgrounds');

const middlewareObj = {};

middlewareObj.authorizedUpdate = (req, res, id, label, body, redirect ='') => {
    label.findByIdAndUpdate(id,  body, (err, foundLabel) => {
        if(!foundLabel){
            req.flash('error', `${foundLabel} not found.`);
            res.redirect('back');
        }
        if (err) {
            req.flash('error', `You are authorized to do that, but there was an error. Contact admins ${err}`);
            res.redirect(`/camps/${redirect}`);
        } else {
            req.flash('success', 'Updated');
            res.redirect(`/camps/${redirect}`);
        }
    });
};

middlewareObj.authorizedDelete = (req, res, id, label, redirect = '') => {
    label.findByIdAndDelete(id, (err, foundLabel) => {
        if(!foundLabel){
            req.flash('error', `${foundLabel} not found.`);
            res.redirect('back');
        }
        if (err){
            req.flash('error', `You have proper authorization to do that, but there was an error. Contact admins ${err}`);
            res.redirect(`/camps/${redirect}`);
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

middlewareObj.errorHandling = (req, res, err) => {
    req.flash('error', `There was an Error: ${err}`);
    res.redirect('back');
};

module.exports = middlewareObj;