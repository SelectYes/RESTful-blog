/////////////////////////////////////////////////////////////////////////////
//                                  APP SETUP
/////////////////////////////////////////////////////////////////////////////

const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const methodOverride = require('method-override');
// const sanitizer = require('express-sanitizer');

mongoose.connect('mongodb://localhost:27017/restful_blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log("Connected to DB!"))
.catch(error => console.log(error.message))

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
// app.use(sanitizer());

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
    });
});


// NEW ROUTE
app.get('/blogs/new', (req, res) => {
    res.render('new');
});


// CREATE ROUTE
app.post('/blogs', (req, res) => {

    // req.body.blog.body = req.sanitize(req.body.blog.body);

    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/blogs');
        }
    });   
});


// SHOW ROUTE
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, retrievedData) => {
        if (err) {
            console.log(err);
        } else {
            console.log('FROM SHOW-ROUTE: ' + req.params.id);
            console.log('FROM SHOW-ROUTE: ' + retrievedData);
            res.render('show', {blog: retrievedData});
        }
    });
});


// EDIT ROUTE
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, retrievedData) => {
        if (err) {
            console.log('ERROR!');
        } else {
            res.render('edit', {blog: retrievedData});
        }
    });
});

// UPDATE ROUTE
app.put('/blogs/:id', (req, res) => {

    // req.body.blog.body = req.sanitize(req.body.blog.body);

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if (err) {
            console.log("ERROR!");
        } else {
            res.redirect(`/blogs/${req.params.id}`);
        }
    });
});


// DELETE ROUTE
app.delete('/blogs/:id', (req, res) => {
    Blog.findOneAndDelete(req.params.id, (err) => {
        if (err) {
            console.log("ERROR!");
        } else {
            console.log('FROM DELETE-ROUTE: ' + req.params.id);
            res.redirect('/blogs');
        }
    })
})


app.listen(port, () => console.log('Serving RESTful Blog on localhost:' + port));