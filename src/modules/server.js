'use strict';

// example of creating an express application with node.js

import express from 'express';
import path from 'path';
// also if we want to avoid modules
// const express = require('express');
// const path = require('path');

const app = express();

// on load port 8080, backend send the index.html to the browser
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// in the front-end we get to this request like this
// fetch('/api/users').then(response => response.json())
// .then(users => console.log(users));
app.get('/api/users', (req, res) => {
  const users = [
    { id: '123', name: 'Marcos' },
    { id: '234', name: 'John' },
  ];
});

app.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
