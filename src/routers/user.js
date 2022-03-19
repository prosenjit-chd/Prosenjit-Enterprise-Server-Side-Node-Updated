const express = require('express');
const auth = require('../middlewares/auth');
const router = new express.Router()

const User = require('../models/user')

//Get all Method*
router.get('/users', auth, async (req, res) => {
    try {
        const data = await User.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// user get api*
router.get('/users/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };

    try {
        const user = await User.findOne(query);
        let isAdmin = false;
        if (user?.role === 'admin') {
            isAdmin = true;
        }
        res.json({ admin: isAdmin });
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// user Post Api*
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// user Put Api
router.patch('/users', async (req, res) => {
    const user = req.body;
    // console.log(user);
    const filter = { email: user.email };
    const options = { upsert: true };
    const updateDoc = { $set: user };
    try {
        const result = await User.updateOne(filter, updateDoc, options);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

// user Patch Api
router.patch('/users/admin', async (req, res) => {
    const user = req.body;
    // const email = user.email;
    const filter = { email: user.email };
    try {
        const updatedData = req.body;
        updatedData["role"] = "admin";
        const options = { new: true };

        const result = await User.updateOne(
            filter, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;