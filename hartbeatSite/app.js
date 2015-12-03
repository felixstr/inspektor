// required when running on node.js
// 		var mqtt = require('mqtt');
var hartbeat_1 = new Audio('1.aiff');
var hartbeat_2 = new Audio('3.aiff');
var hartbeat_3 = new Audio('5.aiff');
var hartbeat_4 = new Audio('9.aiff');


var client = mqtt.connect('mqtt://inspektor1:inspektor@broker.shiftr.io', {
  clientId: 'visual'
});

client.on('connect', function(){
  console.log('client has connected!');

  client.subscribe('/puls');
  // client.unsubscribe('/example');

  setInterval(function(){
//     client.publish('/hello/123', 'world');
  }, 1000);
});

var lastPuls = 0;
var currentPuls = 0;
var interval = null;
var clear = false;
var intervalMS = 0;
var cp = 110;

client.on('message', function(topic, message) {
//   console.log('new message:', topic, message.toString());

  if (topic == '/puls') {
  	
  	
  	currentPuls = message.toString();
//   	currentPuls = 50;
  	
  	console.log('pulsInput', currentPuls);
  	
  	if (currentPuls > 150) {
	  	currentPuls = currentPuls.substring(1, 3);
	  	console.log('crop', currentPuls);
  	}
  	
  	
  	if (currentPuls == 0) {
	  	clearInterval(interval);
	  	interval = null;
  	} else if (lastPuls != currentPuls) {
	  	clear = true;
	  	intervalMS = 60/currentPuls*1000;
	  	
// 	  	console.log('interval', interval);
	  	if (interval == null) {
		  	interval = setInterval(pulsate, intervalMS);
	  	}
  	}
  	
  }

  lastPuls = currentPuls;
});


function pulsate() {
	var hartbeat = hartbeat;
	if (currentPuls < 72) {
		hartbeat = hartbeat_1;
	} else if (currentPuls < 78) {
		hartbeat = hartbeat_2;
	} else if (currentPuls < 100) {
		hartbeat = hartbeat_3;
	} else if (currentPuls < 115){
		hartbeat = new Audio('9.aiff');
	}
	
	hartbeat.currentTime = 0;
	hartbeat.play();
	
	$('#puls').toggleClass('active');
	
	if (clear) {
		clearInterval(interval);
		interval = setInterval(pulsate, intervalMS);
		clear = false;
	}
}

