const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
var request = require('request');
const User = require('./models/user');
const List = require('./models/list');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

//Bot Token
const token = process.env.BotToken;
const bot = new TelegramBot(token, {polling: true});

// Message : /start
bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;

    saveUser(chatId);

    text = "반갑습니다. :)\n*매일 오후 10시에 개발블로그에 오늘 올라온 글들을 모아 보내드립니다. *\n\n"
        +"[awesome-devblog](https://awesome-devblog.netlify.com/)에서 글을 제공받습니다.\n\n"
        +"❤ 제작자 [MiryangJung](https://miryang.dev) ❤";
    bot.sendMessage(chatId, text, {parse_mode: "Markdown"});
});



function sendList() {
    User.find({activate:true})
        .exec(function(err, lists){
            if(err) console.log("User list Error : "+err);
            else {
                for(i=0; i<lists.length; i++){
                    var chatId=lists[i].chatId;
                    todayList(moment().format('YYYY-MM-DD'),chatId);
                }
            }
        });
}


function saveUser(chatId){
    User.find({chatId:chatId})
        .exec()
        .then(data => {
            if(data.length>=1){
                User.findOneAndUpdate({chatId:chatId, activate:false}, {$set:{activate:true}}, function(err) {
                    if(err) console.log('User activate Change to True Error : '+err);
                    else console.log("User activate Change to True : "+chatId);
                })

            }
            if (data.length < 1) {
                const element = new User({
                    _id: new mongoose.Types.ObjectId(),
                    chatId:chatId,
                    join:moment().format('YYYY-MM-DD HH:mm:ss')
                });
                element
                    .save()
                    .then(result => {
                        console.log("User Save : "+result.chatId);
                    })
                    .catch(err => {
                        console.log("User Save Error : " + err);
                    });
            }
        });
}

function deleteUser(chatId){
    User.findOneAndUpdate({chatId:chatId}, {$set:{activate:false}}, function(err) {
            if(err) console.log('User delete Error : '+err);
            else console.log(chatId + " : change activate False");
        })
}

function todayList(today,chatId){
    console.log(today);
    List.find({date:today})
        .exec()
        .then(data => {
            if(data.length>=1){
                var list = "📌 "+today+" 오늘의 글!\n\n";
                for(i=0; i<data.length; i++){
                    list = list + "✔️ "+"[ "+data[i].title+" ]("+data[i].link+")\n";
                }
                list = list+"\n[👏🏻 후원하기](https://toss.im/_m/dp11KU36)";
                return todayListSend(list,chatId)
            }
            if (data.length < 1) {
                return todayListSend("오늘은 올라온 글이 없어요.",chatId)
            }
        })
        .catch(err =>{
            console.log("todayList Find Error : "+err);
            return todayListSend("오늘은 점검 중입니다.",chatId)
         });
}


function todayListSend(msg, chatId){
    bot.sendMessage(chatId, msg,{parse_mode: "Markdown"}).catch((error) => {
        //Error Check
        if(error) {
            console.log(chatId+" Msg Error: "+error.response.body.description);
            // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
            if(error.response.body.description.indexOf("chat not found")!== -1) deleteUser(chatId);
        }
    });
}




module.exports.sendList=sendList;