var fs = require('fs');
const RtmClient = require('@slack/client').RtmClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const WebClient = require('@slack/client').WebClient;
const MemoryDataStore = require('@slack/client').MemoryDataStore;
const IncomingWebhook = require('@slack/client').IncomingWebhook;
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const Server = require('mongodb').Server;
const Db = require('mongodb').Db;
const gdistance = require('gps-distance');
const ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code;
const app = express();
const webhookurl = "url";
const mongoUrl = 'url dbMongo';
var vars = {
    config: {
        selectedToken: "proxy",
        token: {
            proxy: process.env.SLACK_API_TOKEN || 'Token'
        }
    },
    sessions: {}
};
var token = vars.config.token[vars.config.selectedToken];

var dbGlob = null;
var rtm = new RtmClient(token, {
    dataStore: new MemoryDataStore()
});
var web = new WebClient(token);
var channelId = "";
var lastMsgId = {};

///function init proxy
function init() {
    var urlencodedParser = bodyParser.urlencoded({
        extended: false
    });
    MongoClient.connect(mongoUrl, function (err, db) {
        dbGlob = db;
    });
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
        console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}!`);
    });
    //Send messages by Bot Users
    rtm.on(RTM_EVENTS.MESSAGE, getMessage);
    ///Send messages by webhook
    app.post('/slack/slash-commands/send-me-buttons', urlencodedParser,MessageSlahCommands);
    app.post('/slack/actions', urlencodedParser, respondMessageActions);
    ///end
    app.listen(3014, function () {
        console.log("Escucando servidor");
    });
}
///end function

function getMessage(event) {
    if (event.type === "message") {
        channelId = event.channel;
        setSendMessage(event);
    }
}

function MessageSlahCommands(req, res) {
    res.status(200).end();
    var event = req.body;
    messageSlashCommands(event);
}

function respondMessageActions(req, res) {
    res.status(200).end();
    var event = JSON.parse(req.body.payload);
    messageButtonAction(event);
}

////Add script the bot
function getProxyId(context, event, callback) {
    var userId = event.sender;
    var proxy;
    try {
        if (context.simpledb.globalleveldata[userId] == undefined) {
            context.simpledb.globalleveldata[userId] = {};
            proxy = context.simpledb.roomleveldata.proxy;
        }
        var message = event.message.toLowerCase();
        if (message.startsWith('proxy ')) {
            message = message.split(' ');
            context.simpledb.globalleveldata[userId].proxy = message[1];
            context.simpledb.roomleveldata.proxy = message[1];
            proxy = context.simpledb.roomleveldata.proxy;
        }
        callback(context.simpledb.roomleveldata.proxy);
    } catch (e) {
        //console.log("Error de proxy: "+e);
    }
}

function ClientBot(folder) {
    try {
        eval(fs.readFileSync('../clients/' + folder + '/code.js') + '');
        this.MessageHandler = MessageHandler;
        this.MessageButton = MessageButton;
        this.MessageSlash = MessageSlash;
    } catch (e) {
        //console.log("error al cargar el archivo");
    }
}

function getSession(context, event, callback) {
    getProxyId(context, event, function (proxyId) {
        var userId = context.recipient;
        vars.sessions[userId] = new ClientBot(proxyId);
        callback(vars.sessions[userId]);
    });
}

function getSessionMessageButton(context, event, callback){
    var userId = context.recipient;
    vars.sessions[userId] = new ClientBot(context.simpledb.roomleveldata.proxy);
    callback(vars.sessions[userId]);
}

///Init function messages
function initMessageUser(event, callback) {
    var context = new Context(event);
    context.init(function () {
        var evento = new Event(event);
        var userId = event.user;
        getSession(context, evento, function (session) {
            callback(context, evento, session);
        });
    });
}

function initMessageButton(event, callback) {
    var context = new contextMessageButton(event);
    context.init(function () {
        var evento = new eventMessage(event);
        getSessionMessageButton(context, evento, function (session) {
            callback(context, evento, session);
        });
    });
}

function initMessageslash(event, callback){
    var context = new ContextSlash(event);
    context.init(function() {
        var evento = new EventSlash(event);
        getSessionMessageButton(context, evento, function(session) {
            callback(context, evento, session); 
        });
    });
}
///End function

///function messages///
function setSendMessage(event) {
    try {
        initMessageUser(event, function (context, event, session) {
            session.MessageHandler(context, event);
        });
    } catch (e) {
        //console.log(e);
    }
}

function messageButtonAction(event) {
    try {
        initMessageButton(event, function (context, event, session) {
            session.MessageButton(context, event);
        });
    } catch (e) {

    }
}

function messageSlashCommands(event) {
    try{
        initMessageslash(event, function(context, event, session){
            session.MessageSlash(context, event);
        });
    }catch(e){
        
    }
}
///End function messages////

///function of context and event normalmessages
function Context(event) {
    this.console = console;
    this.sendResponse = sendResponse;
    this.recipient = event.user;
    this.webhook = webhookurl;
    this.displayName = rtm.dataStore.getUserById(event.user);
    this.request = request;
    this.simplehttp = {
        parent: this
    };
    this.simpledb = {
        roomleveldata: {},
        botleveldata: {},
        globalleveldata: {},
        parent: this
    };
    var context = this;
    this.getSet = function (channelId) {
        return {
            set: function (obj, prop, value, receiver) {
                obj[prop] = value;
                setChannelData(channelId, obj, prop, function (result) {});
                return true;
            }
        };
    };
    this.init = function (callback) {
        getCurrentData(event.user, event.user, function (records) {
            context.simpledb.roomleveldata = new Proxy(records.room.data, context.getSet(event.user));
            context.simpledb.botleveldata = new Proxy(records.bot.data, context.getSet(event.user));
            context.simpledb.globalleveldata = new Proxy(records.global.data, context.getSet('all'));
            callback();
        });
    };
}

function Event(event) {
    var resp = true;
    this.type = '';
    var userId = event.user;
    this.message = '';
    this.incoming = false;
    if (event.type === "message" && event.text !== "") {
        this.type = event.type;
        this.message = event.text;
    }
    if (lastMsgId[userId]) {
        this.messageobj = {
            refmsgid: lastMsgId[userId]
        };
    }
    this.sender = userId;
}

function contextMessageButton(event) {
    this.console = console;
    this.sendResponse = sendResponse;
    this.sendMessageWebhook = sendMessageToSlackResponseURL;
    this.event = event;
    this.recipient = event.user.id;
    this.request = request;
    this.simplehttp = {
        parent: this
    };
    this.simpledb = {
        roomleveldata: {},
        botleveldata: {},
        globalleveldata: {},
        parent: this
    };
    var context = this;
    this.getSet = function (channelId) {
        return {
            set: function (obj, prop, value, receiver) {
                obj[prop] = value;
                setChannelData(channelId, obj, prop, function (result) {});
                return true;
            }
        };
    };
    this.init = function (callback) {
        getCurrentData(event.user.id, event.user.id, function (records) {
            context.simpledb.roomleveldata = new Proxy(records.room.data, context.getSet(event.user.id));
            context.simpledb.botleveldata = new Proxy(records.bot.data, context.getSet(event.user.id));
            context.simpledb.globalleveldata = new Proxy(records.global.data, context.getSet('all'));
            callback();
        });
    };
}

function eventMessage(event) {
    var resp = true;
    this.type = '';
    var userId = event.user.id;
    this.message = '';
    this.incoming = false;
    if (lastMsgId[userId]) {
        this.messageobj = {
            refmsgid: lastMsgId[userId]
        };
    }
    this.sender = userId;
}

function ContextSlash(event){
   this.console = console;
    this.sendMessageWebhook = sendMessageToSlackResponseURL;
    this.event = event;
    this.webhook = webhookurl;
    this.recipient = event.user_id;
    this.request = request;
    this.simplehttp = {
        parent: this
    };
    this.simpledb = {
        roomleveldata: {},
        botleveldata: {},
        globalleveldata: {},
        parent: this
    };
    var context = this;
    this.getSet = function (channelId) {
        return {
            set: function (obj, prop, value, receiver) {
                obj[prop] = value;
                setChannelData(channelId, obj, prop, function (result) {});
                return true;
            }
        };
    };
    this.init = function (callback) {
        getCurrentData(event.user_id, event.user_id, function (records) {
            context.simpledb.roomleveldata = new Proxy(records.room.data, context.getSet(event.user_id));
            context.simpledb.botleveldata = new Proxy(records.bot.data, context.getSet(event.user_id));
            context.simpledb.globalleveldata = new Proxy(records.global.data, context.getSet('all'));
            callback();
        });
    }; 
}

function EventSlash(event){
    var resp = true;
    this.type = '';
    var userId = event.user_id;
    this.message = '';
    this.incoming = false;
    if (lastMsgId[userId]) {
        this.messageobj = {
            refmsgid: lastMsgId[userId]
        };
    }
    this.sender = userId;
}
///End function context and event normal messages

function getCurrentData(room, bot, callback) {
    getChannelData('all', function (globalData) {
        getChannelData(bot, function (botData) {
            getChannelData(room, function (roomData) {
                callback({
                    global: globalData,
                    room: roomData,
                    bot: botData
                });
            });
        });
    });
}

function getChannelData(channelId, callback) {
    dbGlob.collection('ybot').findOne({
        '_id': channelId
    }, function (err, result) {
        if (result) {
            callback(result);
        } else {
            var record = {
                _id: channelId,
                data: {}
            };
            dbGlob.collection('ybot').save(record, function (err, result) {
                callback(record);
            });
        }
    });
}

function setChannelData(channelId, data, prop, callback) {
    dbGlob.collection('ybot').findOne({
        '_id': channelId
    }, function (err, result) {
        if (result) {
            callback(result);
            var dataExist = result.data[prop];
        }
    });
    dbGlob.collection('ybot').save({
        '_id': channelId,
        'data': data
    }, function (err, result) {
        callback(result);
        dbGlob.collection('ybot').findOne({
            '_id': channelId
        }, function (err, result) {
            if (result) {
                callback(result);
                var dataSaved = result.data[prop];
            }
        });

    });
}

///function sendresponse slack
function sendResponse(text) {
    try {
        rtm.sendMessage(text, channelId);
    } catch (e) {
        //console.log('Error al enviar los datos');
    }
}

function sendMessageToSlackResponseURL(responseURL, JSONmessage) {
    var postOptions = {
        uri: responseURL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: JSONmessage
    };
    request(postOptions, (error, response, body) => {
        if (error) {
            //console.log(error);
        }
    })
}
///end functions
init();
rtm.start();
