#include <stdio.h>
#include <stdlib.h>
#include <wiringPi.h>
#include <wiringSerial.h>
#include <mysql/mysql.h>
#include <stdint.h> //uint8_t definitions
#include <time.h>
#include <sys/types.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <errno.h>
// Pi - arduino serial linking test code.. 
int main(){
    int fd;
    if((fd=serialOpen("/dev/ttyACM0",9600))<0){
        fprintf(stderr,"Unable to open serial device: %s\n", strerror(errno));
        return 1;
    }
    for(;;){
        serialPuts(fd, "hello");
	    delay(50);
        printf("SERIAL PUT\n");
        putchar(serialGetchar(fd));
        printf("SERIAR RCV\n");
        fflush(stdout);
    }
}
