const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const List = require('./models/list');

function crawling() {
    (async () => {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.goto('https://awesome-devblog.netlify.com/domestic/',{
            waitUntil: 'networkidle2', timeout: 500000
        });
        await page.waitForSelector('table tbody');

        const author = await page.evaluate(() => {
            const tds = Array.from(document.querySelectorAll('table tbody td[data-label="Author"] span small'));
            return tds.map(td => td.innerText)
        });
        const link = await page.evaluate(() => {
            const tds = Array.from(document.querySelectorAll('table tbody td[data-label="Title"] span a'));
            return tds.map(td => td.href)
        });
        const title = await page.evaluate(() => {
            const tds = Array.from(document.querySelectorAll('table tbody td[data-label="Title"] span a small'));
            return tds.map(td => td.innerText)
        });
        const date = await page.evaluate(() => {
            const tds = Array.from(document.querySelectorAll('table tbody td[data-label="Date"] span small'));
            return tds.map(td => td.innerText)
        });

        for(i=0; i<title.length; i++) {
            var authstr=author[i].toString();
            var titlestr=title[i].toString();
            titlestr=titlestr.replace(/\[/gi,"");
            titlestr=titlestr.replace(/\]/gi,"");
            var datestr=date[i].toString();
            var linkstr=link[i].toString();

            saveDB(authstr,titlestr,datestr,linkstr);
        }
        await browser.close();
    })();

}

function saveDB(authstr, titlestr,datestr, linkstr){
    List.find({title:titlestr})
        .exec()
        .then(data => {
            if(data.length>=1){
                console.log("Overlapping Database");
            }
            if (data.length < 1) {
                const element = new List({
                    _id: new mongoose.Types.ObjectId(),
                    auth:authstr,
                    title:titlestr,
                    date:datestr,
                    link:linkstr
                });
                element
                    .save()
                    .then(result => {
                        console.log("DB Save : "+result.title);
                    })
                    .catch(err => {
                        console.log("DB Save Error : " + err);
                    });
            }
        });
}

module.exports.crawling=crawling;