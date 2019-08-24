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
        if(err) {
            res.send(`There was an error, press back and try again: ${err.toString()}`);
            res.render('/register');
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('camps');
            });
        }
    });
});
//=====LOGIN=====//
router.get('/login', (req, res) => {
    let loginReq = `Welcome!`;
    res.render('login', {
        loginReq: loginReq,
        baseUrl: req.url
    });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/camps',
    failureRedirect: '/login?user=false'  //add alert user there is no login and to register
}), (req, res) => {
    //callback
});

//=======LOGOUT======//
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

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