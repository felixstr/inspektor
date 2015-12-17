var hartbeat_1 = new Audio('1.mp3');
var hartbeat_2 = new Audio('3.mp3');
var hartbeat_3 = new Audio('5.mp3');
var hartbeat_4 = new Audio('9.mp3');
var lastPuls = 0;
var currentPuls = 0;
var interval = null;
var clear = false;
var intervalMS = 0;
var cp = 110;
var pulsateCounter = 0;
var tweetCounter = 0;

var client = mqtt.connect('mqtt://inspektor1:inspektor@broker.shiftr.io', {
	clientId: 'visual'
});

client.on('connect', function() {
	console.log('client has connected!');
	client.subscribe('/puls');
	// client.unsubscribe('/example');
});
client.on('message', function(topic, message) {
	client_message(topic, message.toString());
});


function client_message(topic, message) {
	if (topic == '/puls') {
		currentPuls = message;
		//   	currentPuls = 58;
		console.log('pulsInput', currentPuls);
		if (currentPuls > 150) {
			currentPuls = currentPuls.substring(1, 3);
			console.log('crop', currentPuls);
		}
		if (currentPuls == 0) {
			clearInterval(interval);
			interval = null;
			// 	  	$('#puls_text').hide();
			// 	  	clearScreen();
		} else if (lastPuls != currentPuls) {
			clear = true;
			intervalMS = 60 / currentPuls * 1000;
			$('#puls_text').show();
			$('#puls_text').html(currentPuls);
			// 	  	console.log('interval', interval);
			if (interval == null) {
				interval = setInterval(pulsate, intervalMS);
			}
		}
	}
	lastPuls = currentPuls;
}

function pulsate() {
	var hartbeat = hartbeat;
	if (currentPuls < 72) {
		hartbeat = hartbeat_1;
		hartbeat = hartbeat_3;
	} else if (currentPuls < 78) {
		hartbeat = hartbeat_2;
		hartbeat = hartbeat_3;
	} else if (currentPuls < 100) {
		hartbeat = hartbeat_3;
	} else {
		// 		hartbeat = new Audio('9.mp3');
		hartbeat = hartbeat_4;
	}
	hartbeat.currentTime = 0;
	hartbeat.play();
	// 	$('#puls').toggleClass('active');
	$('#screen').toggleClass('active');
	increaseScreen();
	
	 
	
	
	if (clear) {
		clearInterval(interval);
		interval = setInterval(pulsate, intervalMS);
		clear = false;
	}
}


function clearScreen() {
	pulsateCounter = 0;
	tweetCounter = 0;
	currentPuls = 0;
	$('#screen').css('height', '0');
	$('#tweets').html('Anzahl Tweets: '+tweetCounter);
}

function increaseScreen() {
	if (pulsateCounter < 100) {
		pulsateCounter += 10;
		$('#screen').removeClass('send');
		$('#screen').css('height', pulsateCounter + 'vh');
		
	} else {
		pulsateCounter = 0;
		tweetCounter++;
		$('#tweets').html('Anzahl Tweets: '+tweetCounter);
		
		$('#screen').addClass('send');
		$('#screen').addClass('transitionS');
		setTimeout(function() {
			
			$('#screen').css('height', pulsateCounter + 'vh');
			$('#screen').removeClass('transitionS');
		}, 300);
		
		$.ajax("http://felixstricker.ch/zhdk/echo/twitter/send.php?t="+currentPuls+"&c="+pulsateCounter, {
			type: 'GET',
			contentType: "application/json",
			success: function(data, textStatus, jqXHR) {
				console.log('data', data);
						
			},
			fail: function(error) {
				console.log('ERROR', error);
			}
		});
	}
	
	
}

$(document).ready(function() {
	
/*
	setInterval(function() {
		client_message('/puls', '55');
	}, 1000);
*/
	
	$('button').click(function() {
		// 		alert("audio clicked");
		hartbeat_1.play();
		hartbeat_1.pause();
		hartbeat_2.play();
		hartbeat_2.pause();
		hartbeat_3.play();
		hartbeat_3.pause();
		hartbeat_4.play();
		hartbeat_4.pause();
		
		$('button').hide();

	});
	$('#puls_text').click(function() {
		clearScreen();
	});
});