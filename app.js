var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("/dev/tty.usbmodem1411", {
    baudrate: 115200
});
var sys = require('sys')
var exec = require('child_process').exec;
var command_acum = "";
var express = require("express");
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

var status = {"armed":0,"firing":0};
var broadcastSocket;
var bash_command ="/Users/geisbruch/workspace/arduino_launcher/command.sh"

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('text', {line: "HLM starting",size:15});
  socket.emit('text', {line: "([H]acking [L]ike a [M]oovie)",size:13});
  socket.emit("text", {line: "",size:10});
  socket.emit('text', {line: "After these stupid lines you are ready to destroy things",size:13});
  socket.emit("text", {line: "",size:10});
  socket.emit("text", {line: "root:/>",size:12});
});

function commandReceived(command, value) {
  console.log(command,value);
  if(command == "armed" && value == 1) {
    console.log("AAA");
    io.sockets.emit("text",{line:"root:/> device on"}); 
    io.sockets.emit("text",{line:"root:/> device prepare"}); 
    io.sockets.emit("text",{line:"your RED launch button is ready, press it !!!"}); 
    io.sockets.emit("text", {line: "",size:10});
  }
  if(command == "armed" && value == 0) {
    io.sockets.emit("text",{line:"root:/> device off"}); 
    io.sockets.emit("text",{line:"WTF?????? are you crazy, prepare this device now !!!!"});
  }
  if(command == "fire" && value == 1) {
    io.sockets.emit("text",{line:"root:/> device fire"}); 
    exec("bash -x -c "+bash_command, function(error, stdout, stderr) {
      if(error) {
          io.sockets.emit("text",{line:"root:/> "+JSON.stringify(error)});
      } else {
        var lines = (stderr+stdout).split("\n");
        for(var line in lines) {
          io.sockets.emit("text",{line:"root:/> "+lines[line]});
        }
      }
    });
  }
};

server.listen(8080);


serialPort.on("open", function () {
  console.log('open');
  serialPort.on('data', function(data) {
    command_acum += data;
    if(command_acum.indexOf("\n") != -1) {
      var pos = command_acum.indexOf("\n");
      var c = command_acum.substring(0, pos);
      if(pos == command_acum.length) {
        command_acum = "";
      } else {
        command_acum = command_acum.substring(pos+1);
      }
      var sp = c.split(":");
      commandReceived(sp[0],sp[1]);
    }
  });
});
