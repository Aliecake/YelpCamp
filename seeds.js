const mongoose = require('mongoose'),
    Campground = require('./models/campgrounds'),
    Comment = require('./models/comments');

const data = [
    {
        name: 'Clouds Rest',
        img: 'https://farm9.staticflickr.com/8471/8137270056_21d5be6f52.jpg',
        desc: 'It felt like we could touch the sky, the beauty of this campground is unexplainable.'
    },
    {
        name: 'Rice Moody',
        img: 'https://farm2.staticflickr.com/1765/29139779108_94633b0bb9.jpg',
        desc: 'Archey, fishing, the BEST hiking paths.'
    },
    {
        name: 'Cape Cod Bay',
        img: 'https://farm4.staticflickr.com/3617/3389236883_ef334dc46c.jpg',
        desc: 'Shark ate my boyfriend. 2 1/2 stars'
    }
];
//this removes all campgrounds
seedDB = () => {
    Campground.deleteMany({}, (err) => {
        if(err){
            console.log('error removing camps', err);
        }
         //add a few campgrounds
        data.forEach((seed) => {
            Campground.create(seed, (err, campground)=> {
                if(err){
                    console.log('error creating seed', err);
                } else {
                      //add a few comments
                      Comment.create(
                          {
                            text: 'This place was great, but I wish there was wifi',
                            author: 'Homer'
                      }, (err, comment) => {
                          if(err) {
                              console.log('Error creating comments', err);
                          } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log('Created new comment');
                          }
                      });
                    console.log('added camp');
                }
            });
        });
    });
};

module.exports = seedDB;