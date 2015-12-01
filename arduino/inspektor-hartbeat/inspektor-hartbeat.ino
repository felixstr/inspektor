#include <Bridge.h>
#include <Console.h>
#include <YunClient.h>
#include <MQTTClient.h>
#include <PinChangeInt.h>
#include <eHealth.h>


YunClient net;
MQTTClient client;

unsigned long lastMillis = 0;

int cont = 0;

void setup() {
  Bridge.begin();
  Console.begin();
  Serial.begin(9600);
  client.begin("broker.shiftr.io", net);

  connect();

  //Attach the inttruptions for using the pulsioximeter.   
  pinMode(3, INPUT);
  attachInterrupt(digitalPinToInterrupt(3), readPulsioximeter, RISING);

  eHealth.initPulsioximeter();
}

void connect() {
  Console.print("connecting...");
  while (!client.connect("arduino", "inspektor1", "inspektor")) {
    Console.print("."); 
  }

  Console.println("\nconnected!");

  // client.subscribe("/example");
  // client.unsubscribe("/example");
}

void loop() {
  client.loop();

  if(!client.connected()) {
    connect();
  }

  // publish a message roughly every second.
  if(millis() - lastMillis > 1000) {
    lastMillis = millis();
    client.publish("/puls", String(eHealth.getBPM()));
  }


  Console.print("PRbpm : "); 
  Console.print(eHealth.getBPM());
  Console.print("\n");
  
}

void messageReceived(String topic, String payload, char * bytes, unsigned int length) {
  Console.print("incoming: ");
  Console.print(topic);
  Console.print(" - ");
  Console.print(payload);
  Console.println();
}

//Include always this code when using the pulsioximeter sensor
//=========================================================================
void readPulsioximeter(){  

  cont ++;

  if (cont == 50) { //Get only of one 50 measures to reduce the latency
    eHealth.readPulsioximeter();  
    cont = 0;
  }
}
