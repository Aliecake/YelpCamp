const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    methodOverride = require('method-override'),
    User = require('./models/users'),
    SeedDB = require('./seeds'),
    flash = require('connect-flash'),
    //requiring routes
    campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/comments'),
    authRoutes = require('./routes/index');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use('*/dist', express.static(__dirname + '/public/dist'));
app.use(methodOverride('_method'));
app.use(flash());

mongoose.connect('mongodb+srv://Aliecake:DZ28DVnNTvoJj1vj@cluster0-t4lx6.mongodb.net/yelpCamp?retryWrites=true&w=majority', {useNewUrlParser: true});

//this removes all campgrounds and comments then reseeds any time server is started for dev mode
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

//middleware to remove currentUser
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/', authRoutes);
app.use('/camps', campgroundRoutes);
app.use('/camps/:id/comments', commentRoutes);


//404 route - goes last
app.get('*', (req, res) => {
    const page = req.url;
    req.flash('error', `ERROR: ${page} 404 Page Not Found. Contact admin if you feel this is an error`);
    res.redirect('/');
});
app.listen(3000, () => {
    console.log('listening on port 3000');
});