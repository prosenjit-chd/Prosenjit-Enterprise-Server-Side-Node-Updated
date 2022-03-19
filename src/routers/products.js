const express = require('express');
const router = express.Router();


const Product = require('../models/products');

/* -------product------ */
// GET All Bike API

router.get('/products', async (req, res) => {
    try {
        const data = await Product.find();
        const page = req.query.page;
        const size = parseInt(req.query.size);
        let products = [];
        const count = await Product.count();
        if (page) {
            products = await data.skip(page * size).limit(size).toArray();
        }
        else {
            products = data;
        }
        res.send({
            count,
            products
        });
        // res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// GET Single Bike API
router.get('/products/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findOne({ _id: id });
        res.send(product);
        // res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//POST Add Bike Admin API 
router.post('/products', async (req, res) => {
    const product = new Product(req.body)

    try {
        await product.save()
        res.status(201).send(product)
    } catch (e) {
        res.status(400).send(e)
    }
})

// DELETE Main Bike 
router.delete('/products/:id', async (req, res) => {
    try {
        // const task = await Task.findOne({ _id:req.params.id, owner: req.user._id })
        const product = await Product.findOneAndDelete({ _id: req.params.id })
        if (!product) {
            return res.status(404).send()
        }

        // task.remove()

        res.send(product)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router;