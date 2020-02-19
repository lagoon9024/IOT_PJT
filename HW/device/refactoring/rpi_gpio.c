#include "rpi_gpio.h"

#include <wiringPi.h>
#include <wiringSerial.h>
#include <errno.h>
#include <math.h>

#include <softTone.h> //beef sound
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h> //uint8_t definitions

//sonic wave set
#define trig 26
#define echo 27
#define maxd 16

// speaker pin set
#define SPEAKER 6

//MOTOR pin set
#define IN1 22
#define IN2 23
#define IN3 24
#define IN4 25

// gpio && serial connection setting
int connectpi(int fd, unsigned long baud, char *device){ 
  printf("%s \n", "Raspberry Startup!");
  fflush(stdout);
 
  //get filedescriptor
  if ((fd = serialOpen (device, baud)) < 0){
    fprintf (stderr, "Unable to open serial device: %s\n", strerror(errno)) ;
    exit(1); //error
  }
 
  //setup GPIO in wiringPi mode
  if (wiringPiSetup () == -1){
    fprintf (stdout, "Unable to start wiringPi: %s\n", strerror (errno)) ;
    exit(1); //error
  }
  return fd;
}

// set deafault pin set
void setdefault(){
    pinMode(trig, OUTPUT) ;
  	pinMode(echo , INPUT) ;
}

// get arduino signal
char* serial_signal(int fd){
	static char data[10];
	data[0]='\0';
	while(1){
		serialPutchar(fd, 49);
		if(serialDataAvail(fd)) break;
		serialFlush(fd);
	}
	int idx=0;
	while(serialDataAvail(fd)){
		char newChar = serialGetchar(fd);
		if(newChar>57 || newChar<48) {
			idx=0;
			continue;
		}
		int len = strlen(data);
		data[idx++]=newChar;
	}
	if(idx!=0) data[idx] = '\0';
	return data;
}

// step motor active code
void setsteps(int w1, int w2, int w3, int w4)
{
	pinMode(IN1, OUTPUT);
	digitalWrite(IN1, w1);
	pinMode(IN2, OUTPUT);
	digitalWrite(IN2, w2);
	pinMode(IN3, OUTPUT);
	digitalWrite(IN3, w3);
	pinMode(IN4, OUTPUT);
	digitalWrite(IN4, w4);
}

void goFront() {
		setsteps(1, 1, 0, 0);
		delay(5);
		setsteps(0, 1, 1, 0);
		delay(5);
		setsteps(0, 0, 1, 1);
		delay(5);
		setsteps(1, 0, 0, 1);
		delay(5);
}

void end() {
	setsteps(0, 0, 0, 0);
}

//get sonicwave
int EMPTYCHECK(){
  int start_time, end_time ;
  float distance ;
  float sum=0;
  for(int i=0;i<5;++i){
  	digitalWrite(trig, LOW) ;
    delay(500) ;
    digitalWrite(trig, HIGH) ;
    delayMicroseconds(10) ;
    digitalWrite(trig, LOW) ;
    while (digitalRead(echo) == 0) ;
    start_time = micros() ;
    while (digitalRead(echo) == 1) ;
    end_time = micros() ;
    distance = (end_time - start_time) / 29. / 2. ;
	sum+=distance;
	printf("distance %.2f cm\n", distance) ;
  }
   sum/=5;
  sum = (1-(sum/maxd))*100;
  int ret = round(sum);
  ret = ret<0?100:ret;
  printf("Bucket filled :: %d percent\n",ret);
  return ret;
}

void melody(){
int scale[4] = { 1568, 1245, 1568, 1245 } ;
  softToneCreate (SPEAKER) ;
  for (int i = 0 ; i < 4 ; ++i){
      printf ("%3d\n", i) ;
      softToneWrite (SPEAKER, scale[i]) ;
      delay (200) ;
    }
}



// #include "rpi_gpio.h"

// #include <wiringPi.h>
// #include <wiringSerial.h>
// #include <errno.h>

// #include <softTone.h> //beef sound
// #include <stdio.h>
// #include <stdlib.h>
// #include <string.h>
// #include <stdint.h> //uint8_t definitions

// // speaker pin set
// #define SPEAKER 6

// //IR pin set
// #define IRRCV 27
// #define IRTSM 26
// #define rcv 1

// //MOTOR pin set
// #define IN1 22
// #define IN2 23
// #define IN3 24
// #define IN4 25

// #define MOTORSPEED 10
// // gpio && serial connection setting
// int connectpi(int fd, unsigned long baud, char *device){ 
//   printf("%s \n", "Raspberry Startup!");
//   fflush(stdout);
 
//   //get filedescriptor
//   if ((fd = serialOpen (device, baud)) < 0){
//     fprintf (stderr, "Unable to open serial device: %s\n", strerror(errno)) ;
//     exit(1); //error
//   }
 
//   //setup GPIO in wiringPi mode
//   if (wiringPiSetup () == -1){
//     fprintf (stdout, "Unable to start wiringPi: %s\n", strerror (errno)) ;
//     exit(1); //error
//   }
//   return fd;
// }

// // set deafault pin set
// void setdefault(){
//     pinMode(IRTSM, OUTPUT);
// 	pinMode(IRRCV, INPUT);
// 	digitalWrite(IRTSM, LOW);
// 	pinMode(SPEAKER, OUTPUT);
// }

// // get arduino signal
// char* serial_signal(int fd){
// 	static char data[10];
// 	data[0]='\0';
// 	while(1){
// 		serialPutchar(fd, 49);
// 		if(serialDataAvail(fd)) break;
// 		serialFlush(fd);
// 	}
// 	int idx=0;
// 	while(serialDataAvail(fd)){
// 		char newChar = serialGetchar(fd);
// 		if(newChar>57 || newChar<48) {
// 			idx=0;
// 			continue;
// 		}
// 		int len = strlen(data);
// 		data[idx++]=newChar;
// 	}
// 	if(idx!=0) data[idx] = '\0';
// 	return data;
// }

// // step motor active code
// void setsteps(int w1, int w2, int w3, int w4)
// {
// 	pinMode(IN1, OUTPUT);
// 	digitalWrite(IN1, w1);
// 	pinMode(IN2, OUTPUT);
// 	digitalWrite(IN2, w2);
// 	pinMode(IN3, OUTPUT);
// 	digitalWrite(IN3, w3);
// 	pinMode(IN4, OUTPUT);
// 	digitalWrite(IN4, w4);
// }

// void goFront(int steps) {
// 	for (int i = 0; i <= steps; ++i) {
// 		setsteps(1, 1, 0, 0);
// 		delay(MOTORSPEED);
// 		setsteps(0, 1, 1, 0);
// 		delay(MOTORSPEED);
// 		setsteps(0, 0, 1, 1);
// 		delay(MOTORSPEED);
// 		setsteps(1, 0, 0, 1);
// 		delay(MOTORSPEED);
// 	}
// }
// void goFront_one() {
// 	setsteps(1, 1, 0, 0);
// 	delay(MOTORSPEED);
// 	setsteps(0, 1, 1, 0);
// 	delay(MOTORSPEED);
// 	setsteps(0, 0, 1, 1);
// 	delay(MOTORSPEED);
// 	setsteps(1, 0, 0, 1);
// 	delay(MOTORSPEED);
// }

// void goBackward(int steps) {
// 	for (int i = 0; i <= steps; ++i) {
// 		setsteps(1, 0, 0, 1);
// 		delay(MOTORSPEED);
// 		setsteps(0, 0, 1, 1);
// 		delay(MOTORSPEED);
// 		setsteps(0, 1, 1, 0);
// 		delay(MOTORSPEED);
// 		setsteps(1, 1, 0, 0);
// 		delay(MOTORSPEED);
		
// 	}
// }

// void end() {
// 	setsteps(0, 0, 0, 0);
// }

// void melody(){
// int scale[23] = { 659, 659, 0, 659, 0, 523, 659, 0, 784, 0,0,0, 392, 0,0,0, 523, 0,0, 392, 0,0,330 } ;
//   softToneCreate (SPEAKER) ;
//   for (int i = 0 ; i < 23 ; ++i){
//       printf ("%3d\n", i) ;
//       softToneWrite (SPEAKER, scale[i]) ;
//       delay (200) ;
//     }
// }

// // IR TRNSMITTING
// void IR_TRANSMITTING(int loop){
//     while (loop--) {
// 		digitalWrite(IRTSM, HIGH);
// 		digitalWrite(IRTSM, LOW);
// 	}
// }

// int EMPTYCHECK(){
// 	if(digitalRead(IRRCV) != rcv)
// 		return 1;
// 	return 0;
// }
 
