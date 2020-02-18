
#include <wiringPi.h>
#include <wiringSerial.h>

#include <softTone.h> //beef sound
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h> //uint8_t definitions
#include <errno.h>

#define SPEAKER 6

void ping_pong(){
int scale[4] = { 1568, 1245 } ;
  softToneCreate (SPEAKER) ;
  for (int i = 0 ; i < 2 ; ++i){
      softToneWrite (SPEAKER, scale[i]) ;
      delay (500) ;
    }
}

void main() {

    if (wiringPiSetup () == -1){
    fprintf (stdout, "Unable to start wiringPi: %s\n", strerror (errno)) ;
    exit(1); //error
  }

    ping_pong();
}