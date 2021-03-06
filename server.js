"use strict";

var express = require("express");
var favicon = require("serve-favicon");
var bodyParser = require("body-parser");
var session = require("express-session");
var consolidate = require("consolidate"); // Templating library adapter for Express
var swig = require("swig"); //Templating agent (like mustache)
var MongoClient = require("mongodb").MongoClient; // Driver for connecting to MongoDB
var http = require("http");
var app = express(); // Web framework to handle routing requests
var routes = require("./app/routes");
var config = require("./config/config"); // Application config properties
var helmet = require('helmet');

var csrf = require('csurf');
var session = require('express-session');

// //Load keys for establishing secure HTTPS connection
// var fs = require("fs");
// var https = require("https");
// var path = require("path");
// var httpsOptions = {
//     key: fs.readFileSync(path.resolve(__dirname, "./app/cert/key.pem")),
//     cert: fs.readFileSync(path.resolve(__dirname, "./app/cert/cert.pem"))
// };

// // Start secure HTTPS server
// https.createServer(httpsOptions, app).listen(config.port, function() {
//     console.log("Express https server listening on port " + config.port);
// });

/*************** SECURITY ISSUES ***************
 ** There are several security issues with    **
 ** this server that can be handled in this   **
 ** file. You should ensure that your         **
 ** application is configured correctly here. **
 **                                           **
 ** XSS: Unless you choose to clean every     **
 **      input to ensure nothing submitted is **
 **      malicious, you should either escape  **
 **      characters in the templating agent   **
 **      (swig) or set an HTTPOnly flag for   **
 **      cookies sent to the client.          **
 ** CSRF: The easiest way to include a token  **
 **       in your forms/headers would be to   **
 **       do so here, using middleware.       **
 **       Check out the csrf module!          **
 ***********************************************/

MongoClient.connect(config.db, function(err, db) {

    swig.setDefaults({
        root: __dirname + "/app/views",
        autoescape: true //default value
    });

    
    if (err) {
        console.log("Error: DB: connect");
        console.log(err);

        process.exit(1);
    }
    console.log("Connected to the database: " + config.db);

    // Adding/ remove HTTP Headers for security
    app.use(favicon(__dirname + "/app/assets/favicon.ico"));
    app.disable("x-powered-by");
    app.use(helmet());

    // Express middleware to populate "req.body" so we can access POST variables
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        // Mandatory in Express v4
        extended: false
    }));

    // Enable session management using express middleware
    app.use(session({
        secret: config.cookieSecret,
        saveUninitialized: true,
        resave: false,
        secret: "s3Cur3",
        cookie: {
            httpOnly: true
            // secure: true
        }
    }));

    app.use(session({
            secret: config.cookieSecret,
            key: "sessionId",
            cookie: {
                httpOnly: true,
                secure: true
            }
        }));

    // Register templating engine
    app.engine(".html", consolidate.swig);
    app.set("view engine", "html");
    app.set("views", __dirname + "/app/views");
    app.use(express.static(__dirname + "/app/assets"));

    // Application routes
    routes(app, db);

    // Template system setup
    swig.setDefaults({
        // Autoescape disabled
        autoescape: false
    });

    // Insecure HTTP connection
    http.createServer(app).listen(config.port,  function() {
        console.log("Express http server listening on port " + config.port);
    });

    //Enable Express csrf protection
    app.use(csrf);

    app.use(function(req, res, next) { 
        res.locals.csrftoken = req.csrfToken(); 
        next(); 
    }); 

});
