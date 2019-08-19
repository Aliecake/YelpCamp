const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Campground = require('./models/campgrounds'),
    Comment = require('./models/comments'),
    User = require('./models/users'),
    SeedDB = require('./seeds');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use('*/dist', express.static(__dirname + '/public/dist'));

mongoose.connect('mongodb://localhost/yelp_camp_db', {useNewUrlParser: true});

SeedDB();

//PASSPORT CONFIG
app.use(session({
    secret: 'Chompy the lizard approves',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to remove currentUser vars
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.get('/', (req, res) => {
    res.render('landing');
});

//INDEX - Show all
app.get('/camps', (req, res) => {
    console.log(req.user)
    Campground.find({}, (err, campgrounds) => {
        if(err) {
            console.log("error populating campgrounds from mongodb", err);
        } else {
            res.render('camps/index', {campgrounds: campgrounds});
        }
    });
});

//CREATE - Add a new camp
app.post('/camps', (req, res) => {
    Campground.create({
        name: req.body.name,
        img: req.body.image,
        desc: req.body.description
    }, (err, camp) => {
        if(err) {
            console.log("Error posting to DB", err);
        } else {
            console.log("Added to DB", camp);
        }
    });
    res.redirect('/camps');
});

//NEW - Show form
app.get('/camps/new', (req, res) => {
    res.render('camps/new');
});

//SHOW further info on individual camps
app.get('/camps/:id', (req, res) => {
    const id = req.params.id;
    Campground.findById(id).populate('comments').exec((err, camp) => {
        if(err) {
            console.log(err);
        } else {
            res.status(200).render('camps/show', {
                camp: camp
            });
        }
    });

});

//====COMMENTS ROUTE====get

app.get('/camps/:id/comments/new', loginCheck, (req, res) => {
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
app.post('/camps/:id/comments', loginCheck, (req, res) => {
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

///AUTH ROUTES - WILL BE MOVED//
app.get('/register', (req, res) => {
    res.render('register');
});
///====SIGN UP======//
app.post('/register', (req, res) => {
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
app.get('/login', (req, res) => {
    const loginReq = `Welcome!`;
    res.render('login', {loginReq: loginReq});
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/camps',
    failureRedirect: '/login'
}), (req, res) => {
    //callback
});

//=======LOGOUT======//
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

//404 route - goes last
app.get('*', (req, res) => {
    res.send('404 not found, press back');
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

app.listen(3000, () => {
    console.log('listening on port 3000');
});