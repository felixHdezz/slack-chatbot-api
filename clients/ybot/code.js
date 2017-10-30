function MessageHandler(context, event) {
    handlers.context = context;
    handlers.webhook = context.webhook;
    handlers.displayName = context.displayName;
    switch (event.message) {
    case 'hola':
        context.sendResponse('Hola que tal soy un bot!');
        break;
    case 'botones':
        //handlers.MessagesHola();
        break;
    case 'order':
        //handlers.getOrder();
        break;
    case 'bot':
        context.sendResponse('Quetal soy un bot, en que te puedo ayudar');
        //context.sendResponse('Hola ' + context.displayName.name + ' soy un bot en que\nte puedo ayudar?');
        break;
    case 'prueba':
        context.sendResponse('este es una prueba de error de codigo');
        break;
    default:
        break;
    }
}

function MessageButtonAction(context, event) {
    console.log('Hola mundo');
}
var handlers = {
    MessagesHola: function () {
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