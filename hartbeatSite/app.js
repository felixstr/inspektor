// required when running on node.js
// 		var mqtt = require('mqtt');
var audio = new Audio('hartbeat.aiff');

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
var interval = null;
var clear = false;
var intervalMS = 0;

client.on('message', function(topic, message) {
//   console.log('new message:', topic, message.toString());

  if (topic == '/puls') {
  	console.log('puls', message.toString());
  	
  	if (message.toString() == 0) {
	  	clearInterval(interval);
	  	interval = null;
  	} else if (lastPuls != message.toString() && message.toString() < 150) {
	  	clear = true;
	  	intervalMS = 60/message*1000;
	  	
	  	console.log('interval', interval);
	  	if (interval == null) {
		  	interval = setInterval(pulsate, intervalMS);
	  	}
  	}
  	
  }

  lastPuls = message.toString();
});


function pulsate() {
	
	audio.currentTime = 0;
	audio.play();
	
	setTimeout(function() {
		$('#puls').toggleClass('active');
	}, 400);
	
	if (clear) {
		clearInterval(interval);
		interval = setInterval(pulsate, intervalMS);
		clear = false;
	}
}

