const express = require('express');
const ExpressError = require('./errorHandler');
const shoppingRoutes = require('./routes');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use('/items', shoppingRoutes);
app.use(morgan('dev'));

app.use((req, res, next) => {
    const e = new ExpressError('Page not found', 404);
    next(e);
});

app.use((error, req, res, next) => {
    let status = error.status || 500;
    let message = error.message;
    return res.status(status).json({ error: { message, status } });
});

module.exports = app;