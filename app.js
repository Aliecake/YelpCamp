const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    // Campground = require('./models/campgrounds'),
    // Comment = require('./models/comments'),
    User = require('./models/users'),
    SeedDB = require('./seeds'),
    //requiring routes
    campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/comments'),
    authRoutes = require('./routes/index');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use('*/dist', express.static(__dirname + '/public/dist'));

mongoose.connect('mongodb://localhost/yelp_camp_db', {useNewUrlParser: true});

//SeedDB();

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

//middleware to remove currentUser
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use('/', authRoutes);
app.use('/camps', campgroundRoutes);
app.use('/camps/:id/comments', commentRoutes);


//404 route - goes last
app.get('*', (req, res) => {
    res.send('404 not found, press back');
});
app.listen(3000, () => {
    console.log('listening on port 3000');
});