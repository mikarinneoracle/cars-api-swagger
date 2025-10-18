const fs = require('fs');
const http = require("http");
const express = require('express');
const app = express();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const port = 3001;
const cars = [{ "id": 1, "name": "Toyota", "price": 20500 }, { "id": 2, "name": "BMW", "price": 47000 }, { "id": 3, "name": "Volvo", "price": 52100 }, { "id": 4, "name": "Tesla", "price": 63900 }];

const apiServer = process.env.api_server == null ? "http://localhost:" + port : "https://" + process.env.api_server;
console.log("API SERVER:" + apiServer);

const logFile = process.env.log_file == null ? "./app.log" : process.env.log_file;
console.log("APP LOG: " + logFile);

// Create a write stream to append logs to a file
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Backup original write functions
const origStdoutWrite = process.stdout.write.bind(process.stdout);

// Patch stdout
process.stdout.write = (chunk, ...args) => {
  try {
    logStream.write(chunk); // write to file
  } catch (err) {
    origStdoutWrite(`\n[Log Error] Failed to write stdout: ${err}\n`);
  }
  return origStdoutWrite(chunk, ...args); // still print to console
};

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cars API",
      version: "2.0.0"
    },
    servers: [
      {
        url: apiServer 
      },
    ],
  },
  apis: ["./index.js"],
};

let specs = swaggerJsdoc(options);
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

/**
 * @swagger
 * tags:
 *   name: Cars API
 *   description: Cars API
 * /cars:
 *   get:
 *     security:
 *       - basicAuth: []
 *     summary: A list of cars
 *     tags: [cars]
 *     responses:
 *       200:
 *         description: A list of cars
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/'
 *             example: { "cars": [{ "id": 1, "name": "Toyota", "price": 20500 }, { "id": 2, "name": "BMW", "price": 47000 }, { "id": 3, "name": "Volvo", "price": 52100 }, { "id": 4, "name": "Tesla", "price": 63900 }] }
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Some server error
 *
 * /car/{id}:
 *   get:
 *     security:
 *       - basicAuth: []
 *     summary: A single car by id
 *     tags: [car]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Car id
 *     responses:
 *       200:
 *         description: A single car by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/'
 *             example: { "car": { "name": "Toyota", "price": 20500 } }
 *       401:
 *         description: Unauthorized 
 *       404:
 *         description: Not found 
 *       500:
 *         description: Some server error
 * /price/{name}:
 *   get:
 *     security:
 *       - basicAuth: []
 *     summary: Car's price by car name
 *     tags: [car]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Car name
 *     responses:
 *       200:
 *         description: Car's price by car name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/'
 *             example: { "car": { "id": 1, "price": 20500 } }
 *       401:
 *         description: Unauthorized 
 *       404:
 *         description: Not found 
 *       500:
 *         description: Some server error
 */

app.get('/cars', (req, res) => {
  var user = req.headers['username'] == null ? "-" : req.headers['username'];
  var json = { "cars": cars };
  console.log("user: " + user + ", json:" + JSON.stringify(json));
  res.send(JSON.stringify(json));
});

app.get('/car/:id', (req, res) => {
  var car = cars.find(element => element.id == req.params['id']);
  var user = req.headers['username'] == null ? "-" : req.headers['username'];
  if(car) {
    var json = { "car": { "name": car.name, "price": car.price } };
    console.log("user: " + user + ", json:" + JSON.stringify(json));
    res.send(JSON.stringify(json));
  } else {
    console.log("user: " + user + ", Car not found, car id =  " + req.params['id']);
    res.status(404).send("Not Found"); 
  }
});

app.get('/price/:name', (req, res) => {
  var car = cars.find(element => element.name == req.params['name']);
  var user = req.headers['username'] == null ? "-" : req.headers['username'];
  if(car) {
    var json = { "car": { "id": car.id, "price": car.price } };
    console.log("user: " + user + ", json:" + JSON.stringify(json));
    res.send(JSON.stringify(json));
  } else {
    console.log("user: " + user + ", Price not found, car name =  " + req.params['name']);
    res.status(404).send("Not Found"); 
  }
});

app.listen(port);
console.log("Listening to port " + port);