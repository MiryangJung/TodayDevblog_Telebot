const express = require("express");
const router = express.Router();
const List = require("../models/list");

router.get('/', (req, res) => {
    res.send("Telegram @TodayDevblog_bot");
});

router.get('/article', (req,res)=>{
    url = "https://todaydevblog.herokuapp.com"+req.url;

    List.find({link:url})
        .exec()
        .then(data => {
            if (data.length === 1) {
                List.findOneAndUpdate({link:url}, {$set: {view: data[0].view + 1}}, function (err) {
                    if (err) console.log('View Update Error : ' + err);
                });
            }
        })
        .catch(err=>{
             console.log('List find Error for view update : '+err);
        });

    res.redirect(req.query.url);
});

module.exports = router;