var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var cors = require('cors');
app.use(cors());
io.on('connection',(socket)=>{

    console.log('new connection made.');

    socket.on('join', function(data){

    socket.join(data.room);
      
    var clientsInRoom = io.nsps['/'].adapter.rooms[data.room].length;
    console.log('clientsInRoom',clientsInRoom);
    let clientRoom = {
        RoomName : data.room,
        RoomLength : clientsInRoom,
        user : data.user
    }
    console.log("clientRoom",clientRoom);
 
      console.log(data.user + ' joined the room : ' + data.room);

      socket.broadcast.to(data.room).emit('new user joined', {user:clientRoom,message:'has joined this room.'});
    
    });

    socket.on('leave', function(data){
    
      console.log(data.user + 'left the room : ' + data.room);

      var clientsInRoom = io.nsps['/'].adapter.rooms[data.room].length;
      let clientRoom = {
        RoomName : data.room,
        RoomLength : clientsInRoom,
        user : data.user
    }
      console.log("leaves",clientsInRoom);
      socket.broadcast.to(data.room).emit('left room', {user:clientRoom, message:'has left this room.'});

      socket.leave(data.room);

    });

    socket.on('message',function(data){
        console.log('message',data);
        let clientRoom = {
          RoomName : data.room,
          user : data.user
      }
        io.in(data.room).emit('new message', {user:clientRoom, message:data.message});
    })
});

  http.listen(3600, () => {
    console.log('listening on port:3600');
  });