/*
* This file is to decide user's group
* var openid
* var group
* move openid to group
*
*
*
* */
var config = require('./config');
var express = require('express');
var app         = express();

var WechatAPI = require('wechat-api');
var api = new WechatAPI(config.appID, config.appsecret);

var open_id = 'ogXmFv7LUd7HVBmADNsPERtWAqGs';
var group_id = '2';


api._moveUserToGroup(open_id,group_id,function(err,res)
{
   console.log(err);
    console.log(res);

});