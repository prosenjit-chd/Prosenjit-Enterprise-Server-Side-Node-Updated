const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router()
// const auth = require('../middlewares/auth');


const Order = require('../models/order');
const User = require('../models/user');

/* -------Order------ */
// GET ORDER API
router.get('/orders', auth, async (req, res) => {
    const user = await User.findOne({ email: req.user.email });
    const ownerId = user._id;

    let query = {};
    if (ownerId) {
        query = { owner: ownerId };
    }

    try {
        const data = await Order.find(query).populate([{ path: "owner", model: "User" }, { path: "product", model: "Product" }]);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/allorders', auth, async (req, res) => {

    try {
        const data = await Order.find().populate([{ path: "owner", model: "User" }, { path: "product", model: "Product" }]);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// POST ORDER API
router.post('/orders', auth, async (req, res) => {
    const user = await User.findOne({ email: req.user.email });
    // const order = new Order(req.body)
    // console.log(req.body)
    const order = new Order({
        ...req.body,
        owner: user._id
    })

    try {
        await order.save()
        res.status(201).send(order)
    } catch (e) {
        res.status(400).send(e)
    }
})


// Update ORDER API
router.patch('/orders/:id', async (req, res) => {
    const id = req.params.id;
    const updateOrder = req.body;
    const filter = { _id: id };
    const options = { upset: true };
    const updateDoc = {
        $set: {
            status: updateOrder.status
        },
    }
    try {
        const result = await Order.updateOne(
            filter, updateDoc, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


// DELETE ORDER API
router.delete('/orders/:id', async (req, res) => {
    try {
        // const task = await Task.findOne({ _id:req.params.id, owner: req.user._id })
        const order = await Order.findOneAndDelete({ _id: req.params.id })
        if (!order) {
            return res.status(404).send()
        }

        // task.remove()

        res.send(order)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router;