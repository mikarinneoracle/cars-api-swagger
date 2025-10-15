const fs = require('fs');
const http = require("http");
const express = require('express');
const app = express();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const cars = [{ "id": "1", "name": "Toyota" }, { "id": "2", "name": "BMW" }, { "id": "3", "name": "Volvo" }, { "id": "4", "name": "Tesla" }];

const apiServer = process.env.api_server == null ? "http://localhost:3000" : "https://" + process.env.api_server;
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
      title: "Cars Express API with Swagger",
      version: "1.0.0",
      description:
        "<a href=\"/\"><font size=+3><input type=\"button\" value=\"Back to Home\"/></font></a>"
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
 *             example: { "cars": [ { "id": "1", "name": "Toyota" }, { "id": "2", "name": "BMW" }, { "id": "3", "name": "Volvo" }, { "id": "4", "name": "Tesla" } ] }
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
 *             example: { "car": { "name": "Toyota" } }
 *       401:
 *         description: Unauthorized 
 *       500:
 *         description: Some server error
 */

app.get('/cars', (req, res) => {
  var json = { "cars": cars };
  console.log("json:" + JSON.stringify(json));
  res.send(JSON.stringify(json));
});

app.get('/car/:id', (req, res) => {
  var car = cars.find(element => element.id == req.params['id']);
  var json ="";
  if(car)
    json = { "car": { "name": car.name } };
  console.log("json:" + JSON.stringify(json));
  res.send(JSON.stringify(json));
});

app.listen(3000);
console.log("Listening to port 3000"); 
