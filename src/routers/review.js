const express = require('express')
const router = new express.Router()
const auth = require('../middlewares/auth')

const Review = require('../models/review')
const User = require('../models/user')

//Get all Review
router.get('/reviews', async (req, res) => {
    try {
        const data = await Review.find().populate({ path: "owner", model: "User" });
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// review Post Api
router.post('/reviews', auth, async (req, res) => {
    const user = await User.findOne({ email: req.user.email });
    // const review = new Review(req.body)
    // console.log(req.body)
    const review = new Review({
        ...req.body,
        owner: user._id
    })

    try {
        await review.save()
        res.status(201).send(review)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router;