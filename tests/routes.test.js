process.env.NODE_ENV = 'test';
const request = require('supertest');

const app = require('../app');
const { ExpectationFailed } = require('http-errors');
let items = require('../fakeDb');

let newItem = { name: 'snickers', price: '1.25' };

beforeEach(function() {
    items.push(newItem);
});

afterEach(function() {
    items.length = 0;
});

describe('GET /items', () => {
    test('Get the list of shopping items', async() => {
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([newItem]);
    });
    test('Attempt to get shopping items when the list is empty', async() => {
        items.length = 0;
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ status: '404', message: 'No shopping items' });
    });
});

describe('POST /items', () => {
    test('Post a new shopping item', async() => {
        let reqBody = { name: 'apples', price: '5.99' };
        const res = await request(app).post('/items').send(reqBody);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ added: reqBody });
    });
    test('Attempt to post a shopping item with the price missing', async() => {
        let reqBody = { name: 'milk' };
        const res = await request(app).post('/items').send(reqBody);
        expect(res.statusCode).toBe(400);
    });
});

describe('GET /items/:name', () => {
    test('Get a shopping item by the name', async() => {
        const res = await request(app).get(`/items/${newItem.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(newItem);
    });
    test('Attempt to get an item that doesnt exist', async() => {
        let unknownItem = 'cheese';
        const res = await request(app).get(`/items/${unknownItem}`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ status: '404', message: `Item with name ${unknownItem} not found.` });
    });
});

describe('PATCH /items/:name', () => {
    test('Update shopping item price', async() => {
        let reqBody = { price: '1.14' };
        const res = await request(app).patch(`/items/${newItem.name}`).send(reqBody);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: newItem });
    });
    test('Attempt to patch an item that doesnt exist', async() => {
        let reqBody = { price: '1.14' };
        const res = await request(app).patch('/items/cheese').send(reqBody);
        expect(res.statusCode).toBe(404);
    });
});

describe('DELETE /items/:name', () => {
    test('Delete shopping item from the list', async() => {
        const res = await request(app).delete(`/items/${newItem.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Deleted' });
    });
    test('Attempt to delete an item that doesnt exist', async() => {
        const res = await request(app).delete('/items/cheese');
        expect(res.statusCode).toBe(404);
    });
});