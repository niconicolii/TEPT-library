"use strict";
const log = console.log;
log("Express server");

const express = require('express');
const path = require('path')

const app = express();

// route for root: should redirect to landing_page
app.get('/',  (req, res) => {
	res.sendFile(path.join(__dirname, '/pub/landing_page.html'));
})

app.use(express.static(__dirname + '/pub'));


const port = process.env.PORT || 5000;
app.listen(port, () => {
	log(`Listening on port ${port}...`)
});