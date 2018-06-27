var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;


var UserIdCounter = 0;
var players = [];
var cards = [];
var lastUpdate = new Date().getTime();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
////////////////////////////////sockets start

io.on('connection', function(socket){
  UserIdCounter++;
  socket.userID = UserIdCounter;
  io.emit('NewUserID', socket.userID);


  socket.on('newUser', function(userID, gameID) {
    var player = {};
    player.userID = userID;
    player.gameID = gameID;
    players[players.length] = player;

    for(i = 0; i < 6; i++) {
      var y = 14.285 * (i + 1 + 0) + 150 * (i + 0) + 75;;

      for(j = 0; j < 6; j++) {
        var x = 57.14 * (j + 1) + 100 * j + 50;

        createCard(j + (i * 6), x, y, userID, gameID);
      }
    }

  });

  socket.on('disconnect', function() {
    for(i = 0; i < players.length; i++) {
      if(players[i].userID === socket.userID) {
        for(j = 0; j < cards.length; j++) {
          if(cards[j].owner === players[i].userID) {
            cards.splice(j, 1);
          }
        }

        players.splice(i, 1);
      }
    }
  });

});

/////////////////////////////////sockets end; functions start

function createCard(element, x, y, owner, game) {
  var card = createSprite(element, x, y, 100, 150);
  card.owner = owner;
  card.gameID = game;

  cards[cards.length] = card;
}

function createSprite(element,x,y,w,h) {
  var result = new Object();
  result.element = element;
  result.x = x;
  result.y = y;
  result.w = w;
  result.h = h;
  return result;
}

/////////////////////////////////functions end; Update start
function Update() {
  if(lastUpdate + 100 <= new Date().getTime()) {
    io.emit('Update', players, cards);

    lastUpdate = new Date().getTime();
  }
  setTimeout(function() {Update();}, 2);
}

Update();

http.listen(port, function(){
  console.log('listening on *:' + port);
});
