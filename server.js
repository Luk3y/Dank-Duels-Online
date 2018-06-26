var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;


var UserIdCounter = 0;
//var lastUpdate = new Date().getTime();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  UserIdCounter++;
  userID.number = UserIdCounter;
  io.emit('NewUserID', socket.userID);

  socket.on('disconnect', function() {

  });

});


/*function Update() {
  if(lastUpdate + 40 <= new Date().getTime()) {

    lastUpdate = new Date().getTime();
  }
  setTimeout(function() {Update();}, 2);
}

Update();*/

http.listen(port, function(){
  console.log('listening on *:' + port);
});
