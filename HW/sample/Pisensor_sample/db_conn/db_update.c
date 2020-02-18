//10초마다 arduino로부터 받은 센서값을 db에 업데이트 시켜주는 코드
 //컴파일 시 아래 명령어대로 컴파일
//gcc -o db_update db_update.c -lmysqlclient -lwiringPi -DRaspberryPi -pedantic -Wall

// just that the Arduino IDE doesnt compile these files.
#ifdef RaspberryPi 
 
//include system librarys
#include <stdio.h> //for printf
#include <stdint.h> //uint8_t definitions
#include <stdlib.h> //for exit(int);
#include <string.h> //for errno
#include <errno.h> //error output

//WiringPi Serial librarys
#include <wiringPi.h>
#include <wiringSerial.h>

//mysql librarys
#define SOCKET int
#include <mysql/mysql.h>

// Find Serial device on Raspberry with ~ls /dev/tty*
// ARDUINO_UNO "/dev/ttyACM0"
// FTDI_PROGRAMMER "/dev/ttyUSB0"
// HARDWARE_UART "/dev/ttyAMA0"
char device[]= "/dev/ttyACM0";

// filedescriptor
int fd;
unsigned long baud = 9600;
unsigned long time=0;

//mysql parameters
static char *host = "localhost";
static char *user = "dev1";
static char *pass = "1234";
static char *dbname = "feed";

//received data - maximum 10 length
char data[10]; 

//prototypes
void loop(void);
void setup(void);
void db(void);

void error(MYSQL *conn)
{
	fprintf(stderr, "%s\n", mysql_error(conn));
	mysql_close(conn);
	exit(1);
}

void setup(){
 
  printf("%s \n", "Raspberry Startup!");
  fflush(stdout);
 
  //get filedescriptor
  if ((fd = serialOpen (device, baud)) < 0){
    fprintf (stderr, "Unable to open serial device: %s\n", strerror (errno)) ;
    exit(1); //error
  }
 
  //setup GPIO in wiringPi mode
  if (wiringPiSetup () == -1){
    fprintf (stdout, "Unable to start wiringPi: %s\n", strerror (errno)) ;
    exit(1); //error
  }
 

}

void send_signal(){
    // Pong every 10 seconds
  if(millis()-time>=10000){
    //serialPuts (fd, "Pong!\n");
    // you can also write data from 0-255
    // 65 is in ASCII 'A', 49 is in ASCII '1'
    serialPutchar (fd, 49);
    time=millis();
  }
}
void receive_data(){
  // Read signal while buffer empty
  if(serialDataAvail(fd)){
    data[0] = '\0'; //데이터 초기화
 
    while(serialDataAvail(fd)){
        char newChar = serialGetchar(fd);
        printf("받아온 1글자는 %c\n", newChar);

        int len = strlen(data);
        data[len]=newChar;
        data[len+1]='\0';   
        fflush(stdout);
    }
    printf("이번 센서값은 %s",data);
    db();
  }
}

void db(){
    //db connect
    MYSQL *conn;
    MYSQL_RES *result;
    conn = mysql_init(NULL);

    int res;
    char buf[1024];

	if(!(mysql_real_connect(conn, host, user, pass, dbname, 0, NULL, 0)))
	{
		fprintf(stderr, "ERROR: %s[%d]\n", mysql_error(conn), mysql_errno(conn));
		exit(1);
	}
	printf("Connection Successful!\n\n");
    

    sprintf(buf, "insert into hello_arduino (weight) values ('%d')", atoi(data));
    res = mysql_query(conn, buf);
    if(!res)
        printf("Insert successful!\n");
    else
        error(conn);

    //mysql_free_result(result);
	mysql_close(conn);
}
 

// main function for normal c++ programs on Raspberry
int main(){
  setup();
  while(1) {
      send_signal();
      receive_data();
  }
  delay(10);
  return 0;
}
 
#endif //#ifdef RaspberryPi