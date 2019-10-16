var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
var mongoose = require("mongoose");
app.listen(8000, () => console.log("listening on port 8000"));


mongoose.connect("mongodb://localhost/board", { useNewUrlParser: true,useUnifiedTopology: true });


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const commentSchema = new mongoose.Schema({
  name: {type: String, required: [true, "Blogs must have a title"], minlength: [3, "Titles must have at least 3 characters"]},
  comment: String
}, {timestamps: true})

const PostSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Posts must have a title"]},
    post: {type: String, required: [true, "Posts must have content"]},
    comments: [commentSchema]
  }, {timestamps: true})


  const Comments = mongoose.model('Comment', commentSchema);
  const Posts = mongoose.model('Post', PostSchema);


app.get("/", (req, res) => {
    arr = Posts.find({},(err, posts) => {
        res.render('index', {arr:posts});
      })
  });




app.post('/post', (req, res) =>{
    const post = new Posts();
    post.name = req.body.name;
    post.post = req.body.post;
    post.save()
        .then(newPost => console.log('new Post' , newPost))
        .catch((err => console.log(err)));
    res.redirect('/');  
});


app.post('/comment/:id', (req, res) =>{
    const comment = req.body;
    Comments.create(comment)
        .then(newComment => {
            return Posts.findOneAndUpdate({_id: req.params.id}, {$push: {comments: newComment}})
        })
        .then(result => console.log(result))
        .catch((err => console.log(err)));
    res.redirect('/');  
});







