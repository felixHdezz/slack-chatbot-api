/** This is a sample code for your bot**/

function MessageHandler(context, event) {
  var message = event.message.toLowerCase();
  if(message.startsWith('proxy ')) {
    var arrProxy = message.split(' ');
    var userId = event.userId;
    context.simpledb.globalleveldata[userId] = {proxy: arrProxy[1]};
    context.sendResponse('Switching proxy.');
  } else {
    context.sendResponse('Invalid proxy request.');
  }
}
        
var handlers = {};

function EventHandler(context, event) {
  console.log('Incoming event.');
}

function HttpResponseHandler(context, event) {
  context.sendResponse(event.getresp);
}
    
function DbGetHandler(context, event) {
  context.sendResponse('Not implemented yet.');
}

function DbPutHandler(context, event) {
  context.sendResponse('Not implemented yet.');
}