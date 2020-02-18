#include "pitches.h"

int dig_speak = 4;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(dig_speak,OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  tone(dig_speak,NOTE_C6,1000);
  delay(1000);
  tone(dig_speak,NOTE_D6,1000);
  delay(1000);
  tone(dig_speak,NOTE_E6,1000);
  delay(1000);
  tone(dig_speak,NOTE_F6,1000);
  delay(1000);
  tone(dig_speak,NOTE_G6,1000);
  delay(1000);
  tone(dig_speak,NOTE_A6,1000);
  delay(1000);
  tone(dig_speak,NOTE_B6,1000);
  delay(1000);
  tone(dig_speak,NOTE_C7,1000);
  delay(1000);
}
