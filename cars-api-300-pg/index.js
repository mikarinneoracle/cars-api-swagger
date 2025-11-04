const fs = require('fs');
const http = require("http");
const express = require('express');
const app = express();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const pg = require('pg');

const API = "300";
const port = 3002;
const { Pool } = pg;
var pool; 

const logFile = process.env.log_file == null ? "./app.log" : process.env.log_file;
console.log("APP LOG: " + logFile);

const secretsFile = process.env.secrets_file;
console.log("SECRETS FILE:" + secretsFile);

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

waitFor(secretsFile);
 
async function waitFor(configFile) {
    try {
     connectionString = await fs.readFileSync(configFile, 'utf8');
     console.log(connectionString);
     if(connectionString != null)
     {

       pool = new Pool({
          connectionString,
          ssl: { rejectUnauthorized: false }
       });
     }
    } catch (ex)
    {
     	//console.log(ex.message);
        setTimeout(function() {
            console.log("Awaiting for " + configFile + " ..");
            waitFor(configFile);
        }, 1000);
    }
}

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cars API",
      version: "3.0.0"
    }
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
 *             example: { "car": { "id": 1, "name": "Toyota", "price": 20500 } }
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
 *             example: { "car": { "id": 1, "name": "Toyota", "price": 20500 } }
 *       401:
 *         description: Unauthorized 
 *       404:
 *         description: Not found 
 *       500:
 *         description: Some server error
 */

app.get('/cars', (req, res) => {
  var user = req.headers['username'] == null ? "-" : req.headers['username'];
  var jsonHdr = { "user": user, "api": API};
  if(pool)
  {
      pool.query('SELECT json_agg(cars) cars FROM cars', function(dberr, dbres) {
        if (dberr) {
            var jsonErr = { "user": user, "error": dberr.message };
            var json = {jsonHdr, jsonErr};
            res.status(500).send(dberr.message);
            console.log(JSON.stringify(json));
        } else {
            var jsonData = { "cars": dbres.rows[0].cars };
            var json = {jsonHdr, jsonData};
            res.send(JSON.stringify(jsonData));
            console.log(JSON.stringify(json));
        }
      });
  } else {
    res.status(503).send("Not Ready");
    var jsonErr = { "error": "Not Ready" };
    var json = {jsonHdr, jsonErr};
    console.log(JSON.stringify(json));
  }
});

app.get('/car/:id', (req, res) => {
  var user = req.headers['username'] == null ? "-" : req.headers['username'];
  var jsonHdr = { "user": user, "api": API};
  if(pool)
  {
      pool.query('SELECT json_agg(cars) cars FROM cars WHERE id= $1', [ req.params['id'] ], function(dberr, dbres) {
        if (dberr) {
            var jsonErr = { "user": user, "error": dberr.message };
            var json = {jsonHdr, jsonErr};
            res.status(500).send(dberr.message);
            console.log(JSON.stringify(json));
        } else {
            if(dbres.rows[0].cars == null) {
                var jsonErr = { "user": user, "error": "Not found, car id =  " + req.params['id'] };
                var json = {jsonHdr, jsonErr};
                res.status(404).send("Not Found");
                console.log(JSON.stringify(json));
            } else {
                var jsonData = { "car": dbres.rows[0].cars[0] }
                var json = {jsonHdr, jsonData};
                res.send(JSON.stringify(jsonData));
                console.log(JSON.stringify(json));
            }
        }
      });
  } else {
    res.status(503).send("Not Ready");
    var jsonErr = { "error": "Not Ready" };
    var json = {jsonHdr, jsonErr};
    console.log(JSON.stringify(json));
  } 
});

app.get('/price/:name', (req, res) => {
  var user = req.headers['username'] == null ? "-" : req.headers['username'];
  var jsonHdr = { "user": user, "api": API};
  if(pool)
  {
      pool.query('SELECT json_agg(cars) cars FROM cars WHERE name= $1', [ req.params['name'] ], function(dberr, dbres) {
        if (dberr) {
            var jsonErr = { "user": user, "error": dberr.message };
            var json = {jsonHdr, jsonErr};
            res.status(500).send(dberr.message);
            console.log(JSON.stringify(json));
        } else {
            if(dbres.rows[0].cars == null) {
                var jsonErr = { "user": user, "error": "Not found, car name =  " + req.params['name'] };
                var json = {jsonHdr, jsonErr};
                res.status(404).send("Not Found");
                console.log(JSON.stringify(json));
            } else {
                var jsonData = { "car": dbres.rows[0].cars[0] };
                var json = {jsonHdr, jsonData};
                res.send(JSON.stringify(jsonData));
                console.log(JSON.stringify(json));
            }
        }
      });
  } else {
    res.status(503).send("Not Ready");
    var jsonErr = { "error": "Not Ready" };
    var json = {jsonHdr, jsonErr};
    console.log(JSON.stringify(json));
  }        
});

app.listen(port);
console.log("Listening to port " + port);