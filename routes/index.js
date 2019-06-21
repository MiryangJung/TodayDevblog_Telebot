const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Telegram @TodayDevblog_bot");
});

router.get('/article/:url', (req,res)=>{
    res.redirect(req.params.url);
});

module.exports = router;