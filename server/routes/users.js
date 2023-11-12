const express = require('express');
const Users = require('../models/Users');
const Posts = require('../models/Posts');
const mongoose = require('mongoose');
const RequireLogin = require('../middleware/RequireLogin');
const router = express.Router();

router.get('/:id', RequireLogin, async (req, res) => {
    try {
        const user = await Users.findOne({ _id: req.params.id }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const posts = await Posts.find({ postedBy: req.params.id }).populate("postedBy", "_id name");
        res.json({ user, posts });
    } catch (err) {
        return res.status(422).json({ error: err.message });
    }
});



router.put('/follow', RequireLogin, (req, res) => {
    const updateFollowedUser = Users.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.users._id }
    }, { new: true }).select("-password");;
    const updateUser = Users.findByIdAndUpdate(req.users._id, {
        $push: { following: req.body.followId }
    }, { new: true }).select("-password");;
    Promise.all([updateFollowedUser, updateUser])
        .then((results) => {
            const followedUserResult = results[0];
            const currentUserResult = results[1];
            res.json({ followedUserResult, currentUserResult });
        })
        .catch((err) => {
            return res.status(422).json({ error: err });
        });
});



router.put('/unfollow', RequireLogin, (req, res) => {
    const unfollowedUserId = req.body.unfollowId;
    const updateUnfollowedUser = Users.findByIdAndUpdate(
        unfollowedUserId,
        { $pull: { followers: req.users._id } },
        { new: true }
    ).select("-password");
    const updateUser = Users.findByIdAndUpdate(
        req.users._id,
        { $pull: { following: unfollowedUserId } },
        { new: true }
    ).select("-password");
    Promise.all([updateUnfollowedUser, updateUser])
        .then((results) => {
            const unfollowedUserResult = results[0];
            const currentUserResult = results[1];
            res.json({ unfollowedUserResult, currentUserResult });
        })
        .catch((err) => {
            return res.status(422).json({ error: err });
        });
});

router.put('/updatepic', RequireLogin, async (req, res) => {
    try {
        const updatedUser = await Users.findByIdAndUpdate(
            req.users._id,
            { $set: { pic: req.body.pic } },
            { new: true }
        ).exec();
        if (!updatedUser) {
            return res.status(422).json({ error: "User not found" });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});



module.exports = router;

