
var fs = require('fs'), //require filesystem module
 Gpio = require('pigpio').Gpio,
  trigger = new Gpio(23, {mode: Gpio.OUTPUT}),
  echo = new Gpio(24, {mode: Gpio.INPUT, alert: true}),
   soundBuzzer = new Gpio(25,{mode: Gpio.OUTPUT}),
    Red = new Gpio(26,{mode:Gpio.OUTPUT}),
    Blue = new Gpio(20,{mode:Gpio.OUTPUT} ),
    Green = new Gpio(21,{mode:Gpio.OUTPUT}),
     laser = 0,
      os = require('os'),
    // spawn = require('child_process').spawn,
     dht = require('dht-sensor'),
    ir = new Gpio(5, {mode:Gpio.INPUT, alert:true}),
    photoElectrico = new Gpio(19,{mode:Gpio.INPUT, alert:true}),
     button = new Gpio(13,{mode: Gpio.OUTPUT, pullUpDown: Gpio.PUD_DOWN, edge: Gpio.EITHER_EDGE}),
     socalo = '',
     current = dht.read(11,16);
      ir = new Gpio(5, {mode:Gpio.INPUT, alert:true}),
      photoElectrico = new Gpio(19,{mode:Gpio.INPUT, alert:true}),
       sockets = {} ;  
       
/*      var options = { 
                    key: fs.readFileSync('server-key.pem'), 
                    cert: fs.readFileSync('server-crt.pem'), 
                    ca: fs.readFileSync('ca-crt.pem'),
                     requestCert:false,
                     rejectUnauthorized:false
                    };*/          
var proc ;
var https = require('http').createServer(handler);

//https.createServer(options,function(req, res){
var io = require('socket.io')(https) //require socket.io module and pass the http object (server)

https.listen(2500);
var  LCD = require('./indexLcd.js'),     lcd = new LCD('/dev/i2c-1',0x3f);

 lcd.createChar( 0,[ 0x1B,0x15,0x0E,0x1B,0x15,0x1B,0x15,0x0E] ).createChar( 1,[ 0x0C,0x12,0x12,0x0C,0x00,0x00,0x00,0x00] );

console.log(`Listening on port 2500`);

lcd.print('Listening on port');
lcd.clear().setCursor(0,1).print('2500');
lcd.setCursor(0,0).print(`Listening on port`);

function handler (req, res){ //create server
 
     fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file index.html in public folder
         if(err){
       res.writeHead(404, {'Content-Type':'text/html'});
          return res.end("404 Not Found");
   }
    
            console.log( new Date() + ' '+ 
             req.connection.remoteAddress+ ' '+
       req.method+ '     '+req.url);
  res.writeHead(200, {'Content-Type': 'text/html'});
   res.write(data);
//  res.end("My Alarm work");
 // res.end('Finished requests ');
}); //require http server, and create server with function handler()

//fs.readFile(__dirname, 'stream');
}



io.sockets.on('connection', function (socket) {// WebSocket Connection
 // var lightvalue = 0; //static variable for current status
/* pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
    }
    lightvalue = value;
    socket.emit('light', lightvalue); //send button status to client
  }); */
socket.on('turnofalarm', function(value){
console.log(`Alarm switched off`);
lcd.clear().setCursor(0,1).print(`was switched off`);
lcd.setCursor(0,0).print(`Alarm EB`);
exit();
});

socket.on('buzzer', function(value){
console.log('Pounding the alarm');
lcd.clear().setCursor(0,1).print(`was pound`);
lcd.setCursor(0,0).print(`Buzzer`);
 buzzy(1);
});
socket.on('rgbLed', function(value){
console.log('Turning on the LED');
lcd.clear().setCursor(0,1).print(`was switched oN`);
lcd.setCursor(0,0).print(`LED`);
triggerRGB(1);

});
socket.on('turnonalarm', function(value){
console.log(`Alarm On`);  
turnonalarm();
});
 socket.emit('liveStream',
// startStreaming
);
 socalo = socket;

});
//   Lcd = require('lcd');
       setInterval(function(){
         readTemperatura();
if (Red.digitalRead() === 0) { //check the pin state, if the state is 0 (or off)
    Red.digitalWrite(1); //set pin state to 1 (turn LED on)
  } else {
    Red.digitalWrite(0); //set pin state to 0 (turn LED off)
  }


},80000 )   ;
/*lcd = new Lcd({
    rs: 12,
    e: 21,
    data: [5, 6, 17, 18],
    cols: 8,
    rows: 2
  }) ; */

button.on('interrupt',function(value){
  console.log(`Button was pressed`);
 lcd.clear().setCursor(0,1).print(`Button was pressed`);
lcd.setCursor(0,0).print(`Alarm EB`);
  if (value) { 
   exit();
}

});

function stopStreaming() {
  if (Object.keys(sockets).length == 0) {
    app.set('watchingFile', false);
    if (proc) proc.kill();
    fs.unwatchFile('./stream/video_stream.h264');
  }
}

function startStreaming() {

  /*if (app.get('watchingFile')) {
    socalo.emit('liveStream', 'video_stream.h264?_t=' + (Math.random() * 100000));
    return;
  }*/

//  var args = ["-w", "1270", "-h", "720", "-o", "-fps 24 |cvlv -vvv ,"stream: ./stream/video_stream.h264",  --sout '#standard{access=http,mux=ts,dst=:8160}': demux=h264'"];
// proc = spawn('raspivid', args);

  var args = ["-w", "640", "-h", "480", "-o", "./stream/image_stream.jpg", "-t", "999999999", "-tl", "100"];
  proc = spawn('raspistill', args);

  console.log('Watching for changes...');

  //app.set('watchingFile', true);

//  fs.watchFile('./stream/video_stream.h264', function(current, previous) {
   // socalo.emit('liveStream', 'video_stream.h264?_t=' + (Math.random() * 100000));
 // })

 fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
   socalo.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
  })

}


// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
var MICROSECDONDS_PER_CM = 1e6/34321;
 
trigger.digitalWrite(0); // Make sure trigger is low
 
(function () {
  var startTick;
  echo.on('alert', function (level, tick) {
    var endTick,
      diff, valueT = 0.0;
    if (level == 1) {
      startTick = tick;
    } else {
      endTick = tick;
      diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      laser =  valueT = diff / 2 ;  
          console.log(`The distance to neraby object is ${valueT} cm`);
       lcd.clear().setCursor(0,1).print(`Distance: ${valueT} cm `);
       lcd.setCursor(0,0).print(`Alarm EB`);

            readTemperatura();
         //         lcd.print(`${valueT} cm`);
          if(valueT < 50 ){

               console.log(`Alarm triggered`);              
               console.log(`Buzzer engage from ${valueT}`);
                lcd.clear().setCursor(0,1).print(`Buzzer engage`);
lcd.setCursor(0,0).print(`Alarm EB`);

              //  lcd.print(valueT);
     ///                if(soundBuzzer.digitalRead()== 1){
                 buzzy(1);
                  triggerRGB(1);
                  }
           else{
                   buzzy(0);
                    triggerRGB(0);
            }
    }
  });

    ir.on('alert', function(data){
     if(socalo){
    //  let dato =  ir.digitalRead();
         if(data){
      //    console.log(`${dato} & ${data } read info ir`);
         readRemoteControl(data);
}
}
});


    photoElectrico.on('alert', function(data){
            if(socalo){
          console.log('Getting the light intensity', data);
          socalo.emit('light', data);
}

});

/*lcd.on('ready', function() {
/*  setInterval(function() {
    lcd.setCursor(0, 0);
    lcd.print(new Date().toString().substring(16, 24));
  }, 1000);
});*/
}());

function readRemoteControl(data){
//let keypressed = ir.digitalRead();
    switch(data){
    case 'KEY_LEFT':
           console.log('left');
            break;

        case 'KEY_RIGHT':
            console.log('right')
            break;

        case 'KEY_DOWN':
            console.log('down');
            return Leds.setAll
           case 'KEY_UP':
            console.log('up');
         break;
         
}


}
function readTemperatura(){
let faren = 0.0;
  faren =  current.temperature * 1.8 + 32;
  console.log(`The Forecast: the humidty is: ${current.humidity} %  and the temperature is: ${faren} F`);
      lcd.clear().setCursor(0,1).print(`Temp: ${faren} F`);
      lcd.setCursor(0,0).print(`Humidity: ${current.humidity} %`);
      sockets[socalo.id]  = socalo;
       let data = { 
                   humidity: current.humidity,
                   temperature: faren,
                   distance: laser,
                   socalo : Object.keys(sockets).length
                  };
       if(socalo){
       socalo.emit('turnonalarm',data);
           }
    if(faren >= 84 ){
      console.log(`Uppppssssss hot hot. Turn on the AC is ${faren} F`);
         lcd.clear().setCursor(0,1).print(`Turn on the AC`);
        lcd.setCursor(0,0).print(`Alarm EB`);
      setInterval(function(){
           buzzy(1);
           triggerRGB(0);
           Red.digitalWrite(1);

},3000);
}
else if(faren  < 65 ){
  console.log(`Uppssss cold. Im freezing... Warm the place a little bit is ${faren} F`);
lcd.clear().setCursor(0,1).print(`To cold..`);
lcd.setCursor(0,0).print(`Alarm EB`);

   setInterval(function(){
    buzzy(1);
     triggerRGB(0);
       Blue.digitalWrite(1);
},3000);

}else{
setTimeout(function(){
Green.digitalWrite(1);
Blue.digitalWrite(0);
Red.digitalWrite(0);
}
,1200000);
}

}
function buzzy(value){
   soundBuzzer.digitalWrite(value);  
}
function triggerRGB(value){
    Red.digitalWrite(value);
    Blue.digitalWrite(value);
   Green.digitalWrite(value);
}
 
// Trigger a distance measurement once per second
setInterval(function () {
  trigger.trigger(10, 1);  // Set trigger high for 10 microseconds
}, 1000);

setInterval(
function(){
exit();
},80000);

function turnoffalarm(){
buzzy(0);
triggerRGB(0);
Green.digitalWrite(1);
console.log('Alarm was switched off');
}

function turnonalarm(){
triggerRGB(0);
/* setInterval(function(){
  Red.digitalWrite(0);
},120000);*/
 'sudo node '
}
function exit(){
buzzy(0);
triggerRGB(0);
//lcd.clear();
 // lcd.close();
  process.exit();
console.log(`Alarm off`);
}
 
process.on('SIGINT', exit);
