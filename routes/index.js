var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var passport = require('passport');
var User = mongoose.model('User');
var jwt = require('express-jwt');
var shortid = require('shortid');


var auth = jwt({
    secret: 'SECRET',
    userProperty: 'payload'
});

router.get('/api/posts', function(req, res, next) {
    Post.find(function(err, posts) {

        if (err) {
            return next(err);
        }

        res.json(posts);
    });
});

router.get('/api/user/:username', function(req, res, next) {
    Post.find({
        'author': req.params.username
    }, function(err, posts) {
        if (err) {
            return next(err);
        }

        res.json(posts);
    });
});

router.post('/api/posts', auth, function(req, res, next) {
    var post = new Post(req.body);
    post.chatId = shortid.generate();
    post.save(function(err, post) {
        if (err) {
            return next(err);
        }

        res.json(post);
    });
});

router.param('post', function(req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function(err, post) {
        if (err) {
            return next(err);
        }
        if (!post) {
            return next(new Error('can\'t find post'));
        }

        req.post = post;
        return next();
    });
});

router.get('/api/posts/:post', function(req, res, next) {
    req.post.populate('comments', function(err, post) {
        if (err) {
            return next(err);
        }

        res.json(post);
    });
});

router.put('/api/posts/:post/upvote', auth, function(req, res, next) {
    req.post.upvote(function(err, post) {
        if (err) {
            return next(err);
        }

        res.json(post);
    });
});

router.post('/api/posts/:post/comments', auth, function(req, res, next) {
    var comment = new Comment(req.body);
    if (req.body.author == 'server') {
        console.log('server posted comment');
        comment.author = 'server';
    } else {
        comment.author = req.payload.username;
    }

    comment.save(function(err, comment) {
        if (err) {
            return next(err);
        }

        req.post.comments.push(comment);
        req.post.save(function(err, post) {
            if (err) {
                return next(err);
            }

            res.json(comment);
        });
    });
});

router.put('/api/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
    req.comment.upvote(function(err, comment) {
        if (err) {
            return next(err);
        }

        res.json(comment);
    });
});

router.param('comment', function(req, res, next, id) {
    var query = Comment.findById(id);

    query.exec(function(err, comment) {
        if (err) {
            return next(err);
        }
        if (!comment) {
            return next(new Error("can't find comment"));
        }

        req.comment = comment;
        return next();
    });
});

router.post('/api/register', function(req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            message: 'Please fill out all fields'
        });
    }

    var user = new User();

    user.username = req.body.username;

    user.setPassword(req.body.password)

    user.save(function(err) {
        if (err) {
            return next(err);
        }

        return res.json({
            token: user.generateJWT()
        })
    });
});

router.post('/api/login', function(req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            message: 'Please fill out all fields'
        });
    }

    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }

        if (user) {
            return res.json({
                token: user.generateJWT()
            });
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

router.get('*', function(req, res) {
    res.render('index');
});



module.exports = router;