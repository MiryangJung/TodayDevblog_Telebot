require('dotenv').config();
const express = require('express');
const app = express();
var path = require('path');
const node_cron = require('node-cron');
const mongoose = require('mongoose');
const PORT= process.env.PORT || 3000;

const Crawl = require("./crawl.js");
const Bot = require("./bot.js");
require('./bot.js');

// DB연결
let url = process.env.DBurl;
mongoose.connect(url, {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

Crawl.crawling();
console.log("Crawling Now!");

// Send message 22:00
node_cron.schedule('20 22 * * *', () => {
    Bot.sendList();
},{
    scheduled: true,
    timezone: "Asia/Seoul"
});



// crawling every hour
node_cron.schedule('30 * * * *', () => {
    Crawl.crawling();
},{
    scheduled: true,
    timezone: "Asia/Seoul"
});

// 1시간마다 크롤링
/*node_cron.schedule('* * * * *', () => {
    Crawl.crawling();
    console.log("Crawling Now!")
});*/


//listen
app.listen(PORT, function () {
    console.log('Listening on port',PORT);
});