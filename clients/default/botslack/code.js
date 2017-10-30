function MessageHandler(context, event) {
    handlers.context = context;
    handlers.webhook = context.webhook;
    handlers.displayName = context.displayName;
    switch (event.message) {
        case 'hola':
            context.sendResponse('Hola ' + context.displayName.name + '! que tal soy un bot... :slightly_smiling_face:');
            break;
        case 'botones':
            try {
                //handlers.MessagesHola();
                context.sendResponse('Este es una prueba');
            } catch (e) {
                console.log('Error');
            }
            break;
        case 'bot':
            context.sendResponse('Que tal ' + context.displayName.name + ' soy un bot en que\nte puedo ayudar?');
            break;
        default:
            context.sendResponse('No entendi tu pregunta ' + context.displayName.name);
            break;
    }
}

var handlers = {
    MessagesHola: function () {
        var payload = {
            "text": "Hola !\nBienvenido a slackbot en que le puedo ayudar",
            "attachments": [
                {
                    "text": "Choose a game to play",
                    "fallback": "You are unable to choose a game",
                    "callback_id": "wopr_game",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "game",
                            "text": "bot",
                            "type": "button",
                            "value": "bot"
                        },
                        {
                            "name": "game",
                            "text": "Falken's Maze",
                            "type": "button",
                            "value": "maze"
                        },
                        {
                            "name": "game",
                            "text": "Thermonuclear War",
                            "style": "danger",
                            "type": "button",
                            "value": "war",
                            "confirm": {
                                "title": "Are you sure?",
                                "text": "Wouldn't you prefer a good game of chess?",
                                "ok_text": "Yes",
                                "dismiss_text": "No"
                            }
                        }
                    ]
                }
            ]
        };
        handlers.context.sendResponse(JSON.stringify(payload));
    }
};