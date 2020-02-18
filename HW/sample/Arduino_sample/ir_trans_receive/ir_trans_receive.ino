//송신과 수신을 동시에 해주는 코드
#include <IRremote.h>
IRsend irsend;
int sensorPin = 0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
 irRead();
 irSend();
}

void irRead(){
   int value = analogRead(sensorPin);
   Serial.println(value);
}

void irSend() {
  irsend.sendSony(0x90,12);
}
