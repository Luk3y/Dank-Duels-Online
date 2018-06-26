var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;


var UserIdCounter = 0;
var players = [];
var lastUpdate = new Date().getTime();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  UserIdCounter++;
  socket.userID = UserIdCounter;
  io.emit('NewUserID', socket.userID);


  socket.on('newUser', function(userID, gameID) {
    var player = {};
    player.userID = userID;
    player.gameID = gameID;
    players[players.length] = player;
  });

  socket.on('disconnect', function() {
    for(i = 0; i < players.length; i++) {
      if(players[i].userID === socket.userID) {
        players.splice(i, 1);
      }
    }
  });

});


function Update() {
  if(lastUpdate + 40 <= new Date().getTime()) {
    io.emit('Update', players);

    lastUpdate = new Date().getTime();
  }
  setTimeout(function() {Update();}, 2);
}

Update();

http.listen(port, function(){
  console.log('listening on *:' + port);
});
