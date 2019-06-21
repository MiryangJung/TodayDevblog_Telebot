const express = require("express");
const router = express.Router();
const List = require("../models/list");

router.get('/', (req, res) => {
    res.send("Telegram @TodayDevblog_bot");
});

router.get('/article', (req,res)=>{
    url = req.query.url;

    List.findOneAndUpdate({link:url}, {$set:{view:view+1}}, function(err) {
        if(err) console.log('View Update Error : '+err);
    });

    res.redirect(url);
});

module.exports = router;