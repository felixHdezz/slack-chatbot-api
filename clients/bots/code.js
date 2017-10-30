var API_URL = 'https://api.api.ai/api/query';
function MessageHandler(context, event) {
    handlers.context = context;
    handlers.webhook = context.webhook;
    handlers.displayName = context.displayName;
//    switch (event.message) {
//        case 'hola':
//            context.sendResponse('Hola buenos dias! ' + context.displayName.name + ', soy un bot... :slightly_smiling_face:');
//            Get_ApiCall(event.message, context, API_URL);
//            break;
//        case 'botones':
//            context.simpledb.roomleveldata.action = 'img';
//            handlers.MessagesHola();
//            break;
//        case 'order':
//            context.simpledb.roomleveldata.action = 'order';
//            handlers.getOrder();
//            break;
//        case 'bot':
//            context.sendResponse('Hola ' + context.displayName.name + ' soy un bot en que\nte puedo ayudar?');
//            break;
//        case 'prueba':
//            context.sendResponse('este es una prueba de error de codigo');
//            break;
//        default:
//            context.sendResponse('Hola mucho gusto ' + context.displayName.name + '\n en que te puedo ayudar?');
//            break;
//        }
    if (event.message) {
        Get_ApiCall(event.message, context, API_URL);
    }
}
///Function MessageButtonActions
function MessageButton(context, event) {
    handlers.context = context;
    handlers.webhook = context.webhook;
    handlers.displayName = context.displayName;
    var action = context.simpledb.roomleveldata.action;
    var url = context.event.response_url;
    if (action === 'order') {
        var message = {
            "response_type": "ephemeral",
            "replace_original": true,
            "attachments": [{
                "text": context.event.original_message.text + "\n" + ":white_check_mark: @" + context.event.user.name + " is order " + context.event.actions[0].value,
                "fallback": context.event.original_message.text + "\n" + ":white_check_mark: @" + context.event.user.name + " is order " + context.event.actions[0].value,
                "callback_id": "button_tutorial",
                "color": "#3AA3E3",
                "attachment_type": "default",
            }],
            "text": ""
        };
        context.sendMessageWebhook(url, message);
        var msg = {
            "replace_original": false,
            "text": "I am a test message http://slack.com",
            "attachments": [
                {
                    "text": "And here's an attachment!"
                }
            ]
        };
        setTimeout(function () {
            context.sendMessageWebhook(url, msg);
        }, 1150);
    } else if (action === 'comand') {
        var message = {
            "response_type": "ephemeral",
            "replace_original": true,
            text: ":white_check_mark: " + context.event.user.name + " is cliked a " + context.event.actions[0].value
        };
        context.sendMessageWebhook(url, message);
    } else if (action === 'img') {
        var message = {
            "response_type": "ephemeral",
            "replace_original": true,
            "attachments": [{
                "text": context.event.original_message.text + "\n" + ":white_check_mark: @" + context.event.user.name + " is order " + context.event.actions[0].value,
                "fallback": context.event.original_message.text + "\n" + ":white_check_mark: @" + context.event.user.name + " is order " + context.event.actions[0].value,
                "callback_id": "button_tutorial",
                "color": "#3AA3E3",
                "attachment_type": "default",
            }],
            "text": ""
        };
        context.sendMessageWebhook(url, message);
        var msg = {
            "replace_original": false,
            "text": "I am a test message http://slack.com",
            "attachments": [
                {
                    "text": "And here's an attachment!"
                }
            ]
        };
        setTimeout(function () {
            context.sendMessageWebhook(url, msg);
        }, 1150);
    } 
}
///End function

///Function MessageSlashCommands
function MessageSlash(context, event) {
    handlers.context = context;
    handlers.webhook = context.webhook;
    handlers.displayName = context.displayName;
    var reqBody = context.event;
    var responseURL = reqBody.response_url;
    var message;
    if (reqBody.command === '/ybot') {
        handlers.context.simpledb.roomleveldata.action = 'comand';
        message = {
            "response_type": "in_channel",
            "text": "It's 80 degrees right now.",
            "attachments": [
                {
                    "text": "Partly cloudy today and tomorrow"
                }
            ]
        };
    } else if (reqBody.command === '/send-me-buttons') {
        handlers.context.simpledb.roomleveldata.action = 'comand';
        if (reqBody.token != "OlEv2OzkD1uFBLgcT6IuIy66") {
            res.status(403).end("Access forbidden")
        } else {
            message = {
                "text": "This is your first interactive message",
                "attachments": [
                    {
                        "text": "Building buttons is easy right?",
                        "fallback": "Shame... buttons aren't supported in this land",
                        "callback_id": "button_tutorial",
                        "color": "#3AA3E3",
                        "attachment_type": "default",
                        "actions": [
                            {
                                "name": "yes",
                                "text": "yes",
                                "type": "button",
                                "value": "yes"
                            },
                            {
                                "name": "no",
                                "text": "no",
                                "type": "button",
                                "value": "no"
                            },
                            {
                                "name": "maybe",
                                "text": "maybe",
                                "type": "button",
                                "value": "maybe",
                                "style": "danger"
                            }
                        ]
                    }
                ]
            };
        }
    } else if (reqBody.command === '/order') {
        handlers.getOrder();
    } else if (reqBody.command === '/button'){
        handlers.MessagesHola();
    }
    context.sendMessageWebhook(responseURL, message);
}
///End function

///Action handlers
var handlers = {
    MessagesHola: function () {
        handlers.context.simpledb.roomleveldata.action = 'img';
        var payload = {
            "text": "New comic book alert!",
            "attachments": [
                {
                    "title": "The Further Adventures of Slackbot",
                    "fields": [
                        {
                            "title": "Volume",
                            "value": "1",
                            "short": true
                        },
                        {
                            "title": "Issue",
                            "value": "3",
                            "short": true
                        }
                    ],
                    "author_name": "Stanford S. Strickland",
                    "author_icon": "http://a.slack-edge.com/7f18https://a.slack-edge.com/bfaba/img/api/homepage_custom_integrations-2x.png",
                    "image_url": "http://i.imgur.com/OJkaVOI.jpg?1"
                },
                {
                    "title": "Synopsis",
                    "text": "After @episod pushed exciting changes to a devious new branch back in Issue 1, Slackbot notifies @don about an unexpected deploy..."
                },
                {
                    "fallback": "Would you recommend it to customers?",
                    "title": "Would you recommend it to customers?",
                    "callback_id": "comic_1234_xyz",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "recommend",
                            "text": "Recommend",
                            "type": "button",
                            "value": "recommend"
                        },
                        {
                            "name": "no",
                            "text": "No",
                            "type": "button",
                            "value": "bad"
                        }
                    ]
                }
            ]
        };
        var requestOption = {
            uri: handlers.webhook,
            method: "POST",
            body: JSON.stringify(payload)
        }
        handlers.context.request(requestOption);
    },
    getOrder: function () {
        handlers.context.simpledb.roomleveldata.action = 'order';
        var payload = {
            "text": "Which lunch optiona would you like?",
            "attachments": [
                {
                    "text": ":hamburger: Hamburger",
                    "fallback": "You are unable to choose a game",
                    "callback_id": "wopr_game",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "Add to order",
                            "text": "Add to order",
                            "type": "button",
                            "value": "Hamburger"
                        }
                    ]
                },
                {
                    "text": ":ramen: Ramen",
                    "fallback": "You are unable to choose a game",
                    "callback_id": "wopr_game",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "Add to order",
                            "text": "Add to order",
                            "type": "button",
                            "value": "Ramen"
                        }
                    ]
                },
                {
                    "text": ":pizza: Pizza",
                    "fallback": "You are unable to choose a game",
                    "callback_id": "wopr_game",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "Add to order",
                            "text": "Add to order",
                            "type": "button",
                            "value": "Pizza"
                        }
                    ]
                }
            ]
        };
        var requestOption = {
            uri: handlers.webhook,
            method: "POST",
            body: JSON.stringify(payload)
        }
        handlers.context.request(requestOption);
    }
};

///function integration api.ai with slack
function Get_ApiCall(MESSEGES, context, SESSION_ID) {
    try {
        var options = {
            method: 'GET',
            url: API_URL,
            qs: {
                v: '20150910',
                query: MESSEGES,
                lang: 'es',
                sessionId: SESSION_ID
            },
            headers: {
                authorization: 'Bearer 03388ca6cc5943209befd7af14c16dad'
            }
        };
        request(options, function (error, response, body) {
            var result = JSON.parse(body);
            resp = result.result.fulfillment.speech;
            context.sendResponse(resp);
        });
    } catch (e) {
        console.log(e);
    }
}