#!/usr/bin/env node

var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var Gpio = require('pigpio').Gpio,
  trigger = new Gpio(23, {mode: Gpio.OUTPUT}),
  echo = new Gpio(24, {mode: Gpio.INPUT, alert: true}),
   soundBuzzer = new Gpio(25,{mode: Gpio.OUTPUT}),
    Red = new Gpio(26,{mode:Gpio.OUTPUT}),
    Blue = new Gpio(20,{mode:Gpio.OUTPUT} ),
    Green = new Gpio(21,{mode:Gpio.OUTPUT}),
     laser = 0,
     dht = require('dht-sensor'),
    ir = new Gpio(5, {mode:Gpio.INPUT, alert:true}),
    photoElectrico = new Gpio(19,{mode:Gpio.INPUT, alert:true});
     button = new Gpio(13,{mode: Gpio.OUTPUT, pullUpDown: Gpio.PUD_DOWN, edge: Gpio.EITHER_EDGE});
      var socalo = '';
      let current = dht.read(11,16);
       http.listen(2500);
    ir = new Gpio(5, {mode:Gpio.INPUT, alert:true}),
    photoElectrico = new Gpio(19,{mode:Gpio.INPUT, alert:true});  
      console.log(`Listening on port 2500`);
       function handler (req, res) { //create server

  fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    } 
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
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
console.log(`Alarm switched off`)
exit();
});
socket.on('turnonalarm', function(value){
console.log(`Alarm On`);  
turnonalarm();
});
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
  if (value) { 
   exit();
}

});
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
            readTemperatura();
         //         lcd.print(`${valueT} cm`);
          if(valueT < 250 ){
               console.log(`Alarm triggered`);              
               console.log(`Buzzer engage from ${valueT}`);
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
  console.log(`The Forecast: the humidty is :${current.humidity} %  and the temperature is: ${faren} F`);
       let data = { 
                   humidity: current.humidity,
                   temperature: faren,
                   distance: laser 
                  };
       if(socalo){
       socalo.emit('turnonalarm',data);
           }
    if(faren >= 81 ){
      console.log(`Uppppssssss hot hot. Turn on the AC is ${faren} F`);
      setInterval(function(){
           buzzy(1);
           triggerRGB(0);
           Red.digitalWrite(1);

},3000);
}
else if(faren  < 69 ){
  console.log(`Uppssss cold. Im freezing... Warm the place a little bit is ${faren} F`);
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
