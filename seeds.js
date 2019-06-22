const mongoose = require('mongoose'),
    Campground = require('./models/campgrounds');


//this removes all campgrounds
seedDB = () => {
    Campground.deleteMany({}, (err) => {
        if(err){
            console.log('error removing camps', err)
        }
    });
    //add a few campgrounds
    //add a few comments
}

module.exports = seedDB;