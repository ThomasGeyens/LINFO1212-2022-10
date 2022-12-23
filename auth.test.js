const request = require('supertest');
const authroutes = require('./authroutes');
const auth = require('./auth');
const express = require('express');
const app = express();

describe('authroutes', () => {
  test('It should return a 401 status code when given an invalid username', async () => {
    const response = await request(authroutes(auth)).post('/login').send({
      username: 'invalid',
      password: 'password'
    });
    expect(response.statusCode).toBe(401);
  });

  // Other test cases go here
});
