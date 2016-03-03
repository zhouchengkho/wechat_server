var weixin      = require('weixin-api');
var express     = require('express');
var app         = express();
var config = require('./config');
var history = require('./history');
var WechatAPI = require('wechat-api');
var api = new WechatAPI(config.appID, config.appsecret);

var server = require('http').Server(app);
var io = require('socket.io')(server);
var socketioJwt = require('socketio-jwt');
var ioClient = require('socket.io-client');

// 接入验证
app.get('/', function(req, res) {

    // 签名成功
    if (weixin.checkSignature(req)) {
        res.status(200).send(req.query.echostr);
        console.log('signature confirmed');
    } else {
        res.status(200).send('fail');
    }
});

// config 根据自己的实际配置填写
weixin.token = '123456';

// 监听文本消息
weixin.textMsg(function(msg) {
    console.log("textMsg received");
    console.log(JSON.stringify(msg));

    var resMsg = {};
    if(msg.content.substr(0,7).toLowerCase() == 'history')
    {
        console.log('looking for history');
        history.searchHistory(msg.content);
        return;
    }
    switch (msg.content) {
        case "Text" :
            // 返回文本消息
            resMsg = {
                fromUserName : msg.toUserName,
                toUserName : msg.fromUserName,
                msgType : "text",
                content : "这是文本回复",
                funcFlag : 0
            };
            break;

        case "Music" :
            // 返回音乐消息
            resMsg = {
                fromUserName : msg.toUserName,
                toUserName : msg.fromUserName,
                msgType : "music",
                title : "Skyland",
                description : "COOL\n",
                musicUrl : "http://music.163.com/#/m/song?id=33785920",
                HQMusicUrl : "http://music.163.com/#/m/song?id=33785920",
                funcFlag : 0
            };
            break;

        case "News" :

            var articles = [];
            articles[0] = {
                title : "Apple",
                description : "Apple Company Website",
                picUrl : "http://caiji72.szonline.net/uploads/allimg/160201/0Z444bb_0.jpg",
                url : "http://www.apple.com"
            };

            articles[1] = {
                title : "Baidu",
                description : "Baidu Search Engine",
                picUrl : "http://pic1a.nipic.com/2008-08-29/2008829222449150_2.jpg",
                url : "http://www.baidu.com"
            };

            articles[2] = {
                title : "Bing",
                description : "Bing Search Engine",
                picUrl : "http://pic.baike.soso.com/p/20131128/20131128160242-216360161.jpg",
                url : "http://www.bing.com"
            };
            // 返回图文消息
            resMsg = {
                fromUserName : msg.toUserName,
                toUserName : msg.fromUserName,
                msgType : "news",
                articles : articles,
                funcFlag : 0
            };
            break;
        default:
            resMsg = {
                fromUserName : msg.toUserName,
                toUserName : msg.fromUserName,
                msgType : 'text',
                content : 'hehe',
                funFlag : 0
            }


    }

    weixin.sendMsg(resMsg);
});

// 监听图片消息
weixin.imageMsg(function(msg) {
    console.log("imageMsg received");
    console.log(JSON.stringify(msg));
});

// 监听位置消息
weixin.locationMsg(function(msg) {
    console.log("locationMsg received");
    console.log(JSON.stringify(msg));
});

// 监听链接消息
weixin.urlMsg(function(msg) {
    console.log("urlMsg received");
    console.log(JSON.stringify(msg));
});

// 监听事件消息
weixin.eventMsg(function(msg) {
    console.log("eventMsg received");
    console.log(JSON.stringify(msg));

    var resMsg = {};
    //This part deal with click information
    if (msg.event == 'CLICK') {
        switch (msg.eventKey) {
            case 'recent':
                var articles = [];
                articles[0] = {
                    title: "Apple",
                    description: "Apple Company Website",
                    picUrl: "http://caiji72.szonline.net/uploads/allimg/160201/0Z444bb_0.jpg",
                    url: "http://www.apple.com"
                };

                articles[1] = {
                    title: "Baidu",
                    description: "Baidu Search Engine",
                    picUrl: "http://pic1a.nipic.com/2008-08-29/2008829222449150_2.jpg",
                    url: "http://www.baidu.com"
                };

                articles[2] = {
                    title: "Bing",
                    description: "Bing Search Engine",
                    picUrl: "http://pic.baike.soso.com/p/20131128/20131128160242-216360161.jpg",
                    url: "http://www.bing.com"
                };
                // 返回图文消息
                resMsg = {
                    fromUserName: msg.toUserName,
                    toUserName: msg.fromUserName,
                    msgType: "news",
                    articles: articles,
                    funcFlag: 0
                };
                break;
            case 'history':

                // Return a text that explains how you can get history message
                resMsg = {
                    fromUserName: msg.toUserName,
                    toUserName: msg.fromUserName,
                    msgType: 'text',
                    content: 'Search History In Format:\n\'history 2016/0/0\'',
                    funcFlag: 0
                };
                break;
            default:
                // 返回图文消息
                resMsg = {
                    fromUserName: msg.toUserName,
                    toUserName: msg.fromUserName,
                    msgType: "text",
                    content: 'Function Under Construction,Sorry',
                    funcFlag: 0
                };
        }
    }
    //This part deal with subscribe
    else if (msg.event == 'subscribe')
    {
        var articles = [];
        articles[0] = {
            title: "Apple",
            description: "Apple Company Website",
            picUrl: "http://caiji72.szonline.net/uploads/allimg/160201/0Z444bb_0.jpg",
            url: "http://www.apple.com"
        };

        articles[1] = {
            title: "Baidu",
            description: "Baidu Search Engine",
            picUrl: "http://pic1a.nipic.com/2008-08-29/2008829222449150_2.jpg",
            url: "http://www.baidu.com"
        };

        articles[2] = {
            title: "Bing",
            description: "Bing Search Engine",
            picUrl: "http://pic.baike.soso.com/p/20131128/20131128160242-216360161.jpg",
            url: "http://www.bing.com"
        };
        // 返回图文消息
        resMsg = {
            fromUserName: msg.toUserName,
            toUserName: msg.fromUserName,
            msgType: "news",
            articles: articles,
            funcFlag: 0
        };
    }
    else
    {
        //default
        //maybe masssend or other things
        //do nothing
    }

    weixin.sendMsg(resMsg);
    //Now this part has to add a method that actually answer the post



});

// Start
app.post('/', function(req, res) {
    console.log('handled by weixin-api');
    // loop
    weixin.loop(req, res);

});

/// With socket.io >= 1.0 ////
io.use(socketioJwt.authorize({
    secret: config.privateKey,
    handshake: true
}));

//This part handles auto alert and broadcast news
/*
 * if there is a consumption alert
 * it should be sent to users
 * but so far we haven't have some open_id bind to wesmart users
 * so testing will just be broadcast for now
 * */
io.on('connection', function (socket) {
    /*
     socket.emit('news', { hello: 'world' });
     socket.on('wesmart request', function (token) {
     // console.log('i am falling asleep');
     //  var data1 = jwt.sign('this is a test','hdiosahodhoashd');
     var data = jwt.verify(token,config.privateKey);
     console.log('receive connection from wesmart');
     console.log(data);
     });
     */
    console.log('receive connection from wesmart');

    // in socket.io 1.0
    console.log('hello! ', socket.decoded_token);
    var info = socket.decoded_token;
    if(info.Type == 'alert')
    {
        api.massSendText(info.content,info.receiver,function(err,res)
        {
           if(err !=null)
           {
               console.log('something happened when trying to send alert');
               return;
           }
            console.log(res);
        });
        console.log('alert sent');
    }
    else if(info.Type = 'broadcast')
    {
        var test_thumb_id = 'dkwuXauPcjySC6IfsU45PZws8mQwnIWksOfBVYZJ7wmVW7s-s86FWDKEdTSTU0Dg';

        //to be done

        //news info should be gotten from var info
        //but for now it's just test
        var news =
        {
            "articles": [
                {
                    "thumb_media_id":test_thumb_id,
                    "author":"xxx",
                    "title":"Happy Day",
                    "content_source_url":"www.qq.com",
                    "content":"content",
                    "digest":"digest",
                    "show_cover_pic":"1"
                },
                {
                    "thumb_media_id":test_thumb_id,
                    "author":"xxx",
                    "title":"Happy Day",
                    "content_source_url":"www.qq.com",
                    "content":"content",
                    "digest":"digest",
                    "show_cover_pic":"0"
                }
            ]
        };
        var media_id = 'BZbgVKhf1mSsKTgq0faHOFMRIW2L8q7keYcRUpeGHJISJAGELORIkLmtfA50DA-t';

        api.uploadNews(news,function(err,response)
        {
            console.log('This is from upload news');
            console.log(err);
            console.log(response);
            if(err !=null)
            {
                console.log('sth wrong from groupsend/index.js');
                res.send('fail');
                return;
            }
            media_id = response.media_id;
        });

        api.massSendNews(media_id,true,function(err,response)
        {
            console.log(err);
            console.log(response);
        });
    }

});

console.log('server running at '+config.app_host+" "+config.port);
server.listen(config.port,config.app_host);