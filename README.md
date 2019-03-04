[![npm](https://img.shields.io/npm/v/drugwars.svg)](https://www.npmjs.com/package/drugwars)
![npm](https://img.shields.io/npm/dm/drugwars.svg)
![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

# DrugWars.js

A lightweight JavaScript library for DrugWars

### Install

To install DrugWars.js on Node.js, open your terminal and run:
```
npm install drugwars --save
```

### Usage
```js
var drugwars = require('drugwars');

// Init WebSocket client
var client = new drugwars.Client('wss://api.drugwars.io');

// Subscribe to notifications
client.subscribe(function(err, result) {
  console.log('Subscribe', result);
});

// Subscribe
client.request('subscribe', 'fabien', function(err, result) {
  console.log('Subscribe', err, result);
});

// Get props
client.request('get_props', null, function(err, result) {
  console.log('Props', err, result);
});

// Get prize props
client.request('get_prize_props', null, function(err, result) {
  console.log('Prize props', err, result);
});

// Get user
client.request('get_user', 'fabien', function(err, result) {
  console.log('User', err, result);
});

// Get users
client.request('get_users', { maxDrugProductionRate: 0.1 }, function(err, result) {
  console.log('Users', err, result);
});

// Get fights
client.request('get_fights', 'fabien', function(err, result) {
  console.log('Attack', err, result);
});
```
