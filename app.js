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
app.use(express.urlencoded({extended: true}))

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

////////////////////////////////////////////////////////////////////////////
//                                 ROUTES
////////////////////////////////////////////////////////////////////////////

// INDEX ROUTE
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {blogs: blogs});
        }
    })
});


// NEW ROUTE
app.get('/blogs/new', (req, res) => {
    res.render('new');
});


// CREATE ROUTE
app.post('/blogs', (req, res) => {
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/blogs');
        }
    })   
})


// SHOW ROUTE
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, retrievedData) => {
        if (err) {
            console.log(err);
        } else {
            res.render('show', {blog: retrievedData});
        }
    });
});


// EDIT ROUTE




app.listen(port, () => console.log('Serving RESTful Blog on localhost:' + port));