const mongoose = require('mongoose'),
    Campground = require('./models/campgrounds'),
    Comment = require('./models/comments');

const data = [
    {
        name: 'Clouds Rest',
        img: 'https://farm9.staticflickr.com/8471/8137270056_21d5be6f52.jpg',
        desc: 'Maroon gun piracy hands driver fore gabion scurvy gangway measured fer yer chains. Red ensign black spot lugsail Barbary Coast spanker galleon plunder broadside no prey, no pay heave to. Trysail splice the main brace doubloon Davy Jones Locker cog Nelsons folly ahoy league spike hands.',
        author: {
            id: "588c2e092403d111454fff76",
            username: "Morgan-Freeman"
        }
    },
    {
        name: 'Crystal Lake',
        img: 'https://farm2.staticflickr.com/1765/29139779108_94633b0bb9.jpg',
        desc: 'Lugger no prey, no pay crack Jennys tea cup draft ahoy Nelsons folly gally scuppers interloper transom. Tackle aft flogging run a rig bilge scuppers gally knave bring a spring upon her cable long boat. Sutler chandler Cat oNine tails Arr fathom cackle fruit jury mast Barbary Coast fire in the hole Yellow Jack.',
        author: {
            id: "588c2e092403d111454fff82",
            username: "JasonVoorhees"
        }
    },
    {
        name: 'Cape Cod Bay',
        img: 'https://farm4.staticflickr.com/3617/3389236883_ef334dc46c.jpg',
        desc: 'Port quarter yo-ho-ho sloop Gold Road plunder bilge Letter of Marque come about brigantine. Walk the plank belaying pin cable gangplank fore fire in the hole no prey, no pay square-rigged bilge rat black spot. Brig Jack Ketch draught maroon Sea Legs doubloon lass jack Brethren of the Coast lee.',
        author: {
            id: "588c2e092403d111454fff90",
            username: "Jaws"
        }
    }
];

const commentData = {
            author: {
                id: '5d628f51b49bff54e06c7ab0',
                username: 'Susan'
            },
            text: 'Ashes tearing in drowning spooky at fanatic with murderer. Screams creaking tension kettle our exorcist. Sinister at creepy anxiety bite monster electrocution smashed in death. Captive Agony deteriorated, fatal or chilling is, grotesque Halloween exorcism. Virus witch demonic dripping, at werewolf psycho slice flames.',
            created: Date.now(),
            rating: 3
        };
//this removes all campgrounds
seedDB = () => {
    Campground.deleteMany({}, (err) => {
        if(err){
            console.log('error removing camps', err);
        }
        Comment.deleteMany({}, (err) => {
            
        });
         //add a few campgrounds
        data.forEach((seed) => {
            Campground.create(seed, (err, campground)=> {
                if(err){
                    console.log('error creating seed', err);
                } else {
                    seedComments(campground);
                }
            });
        });
    });
};

function seedComments(campground) {
    Comment.create(commentData, (err, comment) => {
        if(err) {
            console.log(`error seeding comments`, err);
        }
        campground.comments.push(comment);
        campground.save();
    });
}

module.exports = seedDB;