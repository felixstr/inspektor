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
// 		    console.log('asdf');
  }, 1000);
});

var lastPuls = 0;
var interval = null;
client.on('message', function(topic, message) {
//   console.log('new message:', topic, message.toString());

  if (topic == '/puls') {
  	console.log('puls', message.toString());
  	
  	if (lastPuls != message.toString() && message.toString() < 120) {
	  clearInterval(interval);
	  if (message.toString() > 0) {
	  	interval = setInterval(pulsate, 60/message*1000);
	  }
  	}
  	
  }

  lastPuls = message.toString();
});

// interval = setInterval(pulsate, 60/30*1000);

function pulsate() {
	
	audio.currentTime = 0;
	audio.play();
	
	setTimeout(function() {
		$('#puls').toggleClass('active');
	}, 400);
}