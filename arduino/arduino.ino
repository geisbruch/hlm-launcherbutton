/*
 Input Pullup Serial
 
 This example demonstrates the use of pinMode(INPUT_PULLUP). It reads a 
 digital input on pin 2 and prints the results to the serial monitor.
 
 The circuit: 
 * Momentary switch attached from pin 2 to ground 
 * Built-in LED on pin 13
 
 Unlike pinMode(INPUT), there is no pull-down resistor necessary. An internal 
 20K-ohm resistor is pulled to 5V. This configuration causes the input to 
 read HIGH when the switch is open, and LOW when it is closed. 
 
 created 14 March 2012
 by Scott Fitzgerald
 
 http://www.arduino.cc/en/Tutorial/InputPullupSerial
 
 This example code is in the public domain
 
 */

const int armedPin = 8;
const int firePin = 12;
const int onPin = 11;
const int firingPin = 10;

int armedStatus = 0;
int fireStatus = 1;

void setup(){
  //start serial connection
  Serial.begin(115200);
  //configure pin2 as an input and enable the internal pull-up resistor
  pinMode(armedPin, INPUT_PULLUP);
  pinMode(firePin, INPUT_PULLUP);
  pinMode(onPin, OUTPUT); 
  pinMode(firingPin, OUTPUT); 
  digitalWrite(onPin,HIGH);
}

int flapRead(int lastStatus, int pin) {
  int localStatus = digitalRead(pin);
  if(localStatus != lastStatus) {
    delay(10);
    localStatus = digitalRead(pin);
  }
  return localStatus;
}

void loop(){
  //read the pushbutton value into a variable
  int armed = flapRead(armedStatus, armedPin);
  int firing = flapRead(fireStatus, firePin);
  
  if(armed != armedStatus) {
    armedStatus = armed;
    Serial.print("armed:");
    Serial.println(armedStatus);  
  }
    
  
  if(armedStatus == HIGH) {
    if(fireStatus != firing) {
      fireStatus = firing;
      if(firing == LOW) {
        Serial.println("fire:1");
      }
    } 
    if(fireStatus == LOW) {
      digitalWrite(firingPin, HIGH);
    } else {
      digitalWrite(firingPin, HIGH);
      delay(300);
      digitalWrite(firingPin, LOW);
      delay(200);
    }
  }
  
}



