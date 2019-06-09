const express = require('express');
const app = express();

const campgrounds = [
    {'name': 'fitch', 'img': 'https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg'},
    {'name': 'rice moody','img': 'https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg'}
];

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/camps', (req, res) => {
    res.render('camps', {campgrounds: campgrounds});
});

app.get('*', (req, res) => {
    res.send('404 not found, press back')
});
app.listen(3000, () => {
    console.log('listening on port 3000');
});