const port = process.env.PORT || jordanasatlandingpage3.herokuapp.com;
const server = require("http").Server();

var io = require("socket.io") (server);
//var allusers1 = [];
//var allusers2 = [];
var allusers = {};
var allstickers = {};

io.on("connection", function(socket){
    console.log("connect");
    //allusers.push(socket.id);
    //console.log(allusers);
    
    //socket.emit("yourid", socket.id);
    
    //io.emit("userjoined", allusers);
    socket.on("stick", function(data){
        allstickers[this.myRoom].push(data);
        
        io.to(this.myRoom).emit("newsticker",
        allstickers[this.myRoom]);
    });
    
    socket.on("joinroom", function(data){
        console.log(data)
        socket.join(data);
        
        socket.myRoom = data;
        socket.emit("yourid", socket.id);
        
        if(!allusers[data]){
            allusers[data] = [];
        }
        if(!allstickers[data]){
            allstickers[data] = [];
        }
        
        allusers[data].push(socket.id);
        io.to(data).emit("userjoined", allusers[data]);
        io.to(data).emit("newsticker", allstickers[data]);
        
        
        /*if(data == "room1"){
            allusers1.push(socket.id);
            io.to(data).emit("userjoined", allusers1);
            
        } else if (data == "room2"){
            allusers2.push(socket.id);
            io.to(data).emit("userjoined", allusers2);
        }
        */
    });
    
    socket.on("mymove", function(data){
    socket.to(this.myRoom).broadcast.emit("newmove", data);    
    });
    
    
    socket.on("disconnect", function(){
        /*var index = allusers.indexOf(socket.id);
        allusers.splice(index, 1);
        io.emit("userjoined", allusers);*/
        if(this.myRoom){
            var index = allusers[this.myRoom].indexOf(socket.id);
            allusers[this.myRoom].splice(index, 1);
            io.to(this.myRoom).emit("userjoined", allusers[this.myRoom]);
        }
    

    })
});

server.listen(port,(err)=>{
    if(err){
        console.log(err);
        return false;
    }
    
    console.log("Port is running");
})









