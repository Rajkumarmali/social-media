const express = require('express');
const Posts = require('../models/Posts');
const router = express.Router();
const RequireLogin = require('../middleware/RequireLogin');
const Users = require('../models/Users');

router.post('/create-post', RequireLogin, (req, res) => {
    const { title, body, photo } = req.body;
    if (!title || !body || !photo)
        return res.status(422).json({ error: "Please provide all field" });
    req.users.password = undefined
    const post = new Posts({
        title, body,
        photo,
        postedBy: req.users
    })
    post.save().then(result => {
        res.json({ post: result });
    }).catch(err => {
        console.log(err);
    })
})

router.get('/allpost', RequireLogin, (req, res) => {
    Posts.find().populate("postedBy", "_id name pic").populate("comments.postedBy", "_id name").sort('-createdAt').then(posts => {
        res.json({ posts });

    }).catch(err => {
        console.log(err);
    })
})
router.get('/getsubpost', RequireLogin, (req, res) => {
    Posts.find({ postedBy: { $in: req.users.following } }).populate("postedBy", "_id name").populate("comments.postedBy", "_id name").sort('-createdAt').then(posts => {
        res.json({ posts });

    }).catch(err => {
        console.log(err);
    })
})

// router.get('/mypost', RequireLogin, (req, res) => {
//     Posts.find({ postedBy: req.users._id }).populate("postedBy", "_id name").then(mypost => {
//         res.json({ mypost })
//     }).catch(err => {
//         console.log(err)
//     })
// })

router.get('/mypost', RequireLogin, async (req, res) => {
    try {
        const user = await Users.findOne({ _id: req.users._id }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const mypost = await Posts.find({ postedBy: req.users._id }).populate("postedBy", "_id name");
        res.json({ user, mypost });
    } catch (err) {
        return res.status(422).json({ error: err.message });
    }
})
router.put('/like', RequireLogin, (req, res) => {
    Posts.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.users._id }
    }, {
        new: true
    })
        .populate("postedBy", "_id name")
        .exec()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.status(422).json({ error: err.message });
        });
});

router.put('/unlike', RequireLogin, (req, res) => {
    Posts.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.users._id }
    }, {
        new: true
    })
        .populate("postedBy", "_id name")
        .exec()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.status(422).json({ error: err.message });
        });
});

router.put('/comment', RequireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.users._id
    }
    Posts.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment },
    }, {
        new: true
    })
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.status(422).json({ error: err.message });
        });
});

router.delete('/deletpost/:postId', RequireLogin, async (req, res) => {
    Posts.findByIdAndRemove(req.params.postId)
        .then(deletedPost => {
            if (!deletedPost) {
                return res.status(404).json({ error: 'Post not found' });
            }
            return res.json(deletedPost);
        })
        .catch(err => {
            return res.status(500).json({ error: 'An error occurred while deleting the post.' });
        });
});

module.exports = router;