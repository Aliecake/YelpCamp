const express = require('express'),
    passport = require('passport'),
    router = express.Router(),
    User = require('../models/users');


    router.get('/', (req, res) => {
        res.render('landing');
});

///=======AUTH ROUTES========//
router.get('/register', (req, res) => {
    res.render('register');
});
///====SIGN UP======//
router.post('/register', (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if(err || !user) {
            middleware.errorHandling(req, res, err);
        } else {
            passport.authenticate('local')(req, res, () => {
                req.flash(`success`, `Welcome! Thanks for signing up ${req.body.username}!`);
                res.redirect('camps');
            });
        }
    });
});
//=====LOGIN=====//
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/camps',
    failureRedirect: '/login' //error for wrong login credentials?
}), (req, res) => {
    //callback
});

//=======LOGOUT======//
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Success: You have logged out!');
    res.redirect('/');
});

module.exports = router;