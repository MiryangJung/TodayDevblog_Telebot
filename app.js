require('dotenv').config();
const express = require('express');
const app = express();
var path = require('path');
const node_cron = require('node-cron');
const mongoose = require('mongoose');
const PORT= process.env.PORT || 3000;

const Crawl = require("./crawl.js");
const Bot = require("./bot.js");
const indexRoute = require("./routes/index");
require('./bot.js');

// DB연결
let url = process.env.DBurl;
mongoose.connect(url, {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

// Send message 22:00
node_cron.schedule('0 22 * * *', () => {
    Bot.sendList();
},{
    scheduled: true,
    timezone: "Asia/Seoul"
});



// crawling every hour
node_cron.schedule('30 * * * *', () => {
    Crawl.crawling();
    console.log("Crawling now!")
},{
    scheduled: true,
    timezone: "Asia/Seoul"
});


// use routes
app.use("/", indexRoute);

//listen
app.listen(PORT, function () {
    console.log('Listening on port',PORT);
});