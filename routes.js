const express = require('express');
const ExpressError = require('./errorHandler');
const router = new express.Router();
const items = require('./fakeDb');
const { body, validationResult } = require('express-validator');

module.exports = router;

//renders a list of shopping items.
router.get('/', (req, res) => {
    if (items.length === 0) {
        res.status(404).json({ status: '404', message: 'No shopping items' });
    }
    res.json(items);
});

//accepts JSON data and adds it to the shopping list.
router.post('/', body('name').exists(), body('price').exists(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const newItem = { name: req.body.name, price: req.body.price };
    items.push(newItem);
    res.status(201).json({ added: newItem });
});

//displays a single item’s name and price.
router.get('/:name', (req, res) => {
    const foundItem = items.find((item) => item.name === req.params.name);
    if (!foundItem) {
        return res.status(404).json({ status: '404', message: `Item with name ${req.params.name} not found.` });
    }
    res.json(foundItem);
});

//modifies a single item’s name and/or price.
router.patch('/:name', (req, res) => {
    const foundItem = items.find((item) => item.name === req.params.name);
    if (!foundItem) {
        return res.status(404).json({ status: '404', message: `Item with name ${req.params.name} not found.` });
    }
    if (req.body.name) foundItem.name = req.body.name;
    if (req.body.price) foundItem.price = req.body.price;
    res.json({ updated: foundItem });
});

//deletes a specific item from the array.
router.delete('/:name', (req, res) => {
    const foundItem = items.findIndex((item) => item.name === req.params.name);
    if (foundItem === -1) {
        return res.status(404).json({ status: '404', message: `Item with name ${req.params.name} not found.` });
    }
    items.splice(foundItem, 1);
    res.json({ message: 'Deleted' });
});