/////////////////////////////////////////////////////////////////////////////
//                                  APP SETUP
/////////////////////////////////////////////////////////////////////////////

const express = require('express');
const app = express();
const port = 3000;

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/restful_blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to DB!"))
.catch(error => console.log(error.message));

app.use(express.static('public'))
app.set('view engine', 'ejs');

////////////////////////////////////////////////////////////////////////////
//                               MODEL CONFIG
////////////////////////////////////////////////////////////////////////////

const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

const Blog = mongoose.model('Blog', blogSchema);

Blog.create({
    title: "Hello World!",
    image: "www.image.com",
    body: "This is my first blog post!",
});

////////////////////////////////////////////////////////////////////////////
//                                 ROUTES
////////////////////////////////////////////////////////////////////////////

app.get('/blogs', (req, res) => {
    res.render('index');
});

app.listen(port, () => console.log('Serving RESTful Blog on localhost:' + port));