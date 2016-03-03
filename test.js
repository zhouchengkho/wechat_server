var weixin      = require('weixin-api');
var express     = require('express');
var app         = express();
var config = require('./config');
var history = require('./node_modules/weixin-api/lib/history');
var WechatAPI = require('wechat-api');
var jwt = require('jsonwebtoken');
var api = new WechatAPI(config.appID, config.appsecret);
var server = require('http').Server(app);
var io = require('socket.io')(server);
var socketioJwt = require('socketio-jwt');
var ioClient = require('socket.io-client');

//app.listen(config.port,config.app_host);
server.listen(3000);
// config 根据自己的实际配置填写
weixin.token = '123456';
// 接入验证
app.get('/', function(req, res) {
    console.log('handling signature');
    // 签名成功
    if (weixin.checkSignature(req)) {
        res.status(200).send(req.query.echostr);
        console.log('signature confirmed');
    } else {
        res.status(200).send('fail');
    }
});


//// With socket.io >= 1.0 ////
io.use(socketioJwt.authorize({
    secret: config.privateKey,
    handshake: true
}));


//This part handles auto warning
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

});


//received a message
app.post('/movegroup', function(req,res){
    //step by step
    //for now just upload the news
    //and get the news' media_id

    /*console.log('move group test');
    var openID = req.query.openID;
    var groupID = req.query.groupID;

    if(openID==null || groupID== null)
    {
        console.log('move user format error,check your request');
        res.send('move fail');
        return;
    }
    api.moveUserToGroup(openID,groupID,function(err,res)
    {
        console.log(err);
        console.log(res);
    })
    res.send('Mass sending');

    console.log('file sent')*/
    //test the webtoken thing



});

/*
 var WechatAPI = require('wechat-api');

 var api = new WechatAPI(config.appID, config.appsecret);
 api.updateRemark('open_id', 'remarked', function (err, data, res) {
 // TODO
 console.log('running past here');

 });
 */
//test the socket receive&send
/*
* when received wesmart token,format varied
* but first we should test the massSend
* so default the token will be like:
*
* {
* requestType:'massSend',
* msgType:'text',
* content:'this is content',
* receiver:'2',
*
* }
*
*
*
* */


//For broadcast
app.post('/sendgroup', function(req,res){
    console.log('handled by wechat-api');
    var test_thumb_id = 'dkwuXauPcjySC6IfsU45PZws8mQwnIWksOfBVYZJ7wmVW7s-s86FWDKEdTSTU0Dg';

    //to be done

    //news info should be gotten from params
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
    /*
     api.previewImage('ogXmFv7LUd7HVBmADNsPERtWAqGs','4WSP8NDUWaomeINhVev2tEdtWHcbzNjmuIeKcP7OzVHcpKGcMza9GCWpBTXMCho6' , function(err , response)
     {
     console.log(err);
     console.log(response);
     });
     */
    //   console.log('callback '+callback);
    console.log('should have sent');
    res.send('upload finish');
});

console.log(config.app_host+" "+config.port);
