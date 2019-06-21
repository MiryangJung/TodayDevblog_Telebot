const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Telegram @TodayDevblog_bot");
});

router.get('/article', (req,res)=>{
    res.redirect(req.query.url);
});

module.exports = router;