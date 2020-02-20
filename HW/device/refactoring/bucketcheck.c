#include "rpi_gpio.h"
#include "SQL_query.h"

#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[])
{
	// device path
	char *device= "/dev/ttyACM0";

	// file descriptor
	int fd=0;
	unsigned long baud = 9600;

	//sql settings
	static char *host = "localhost";
	static char *user = "dev1";
	static char *pass = "1234";
	static char *dbname = "feed";

	fd = connectpi(fd, baud, device);
	setdefault();
	char* data = serial_signal(fd);
	int remainfood = atoi(data);

	MYSQL *conn = connectsql(host,user,pass,dbname);
	int getprev= get_last_eaten(conn);
	int loopcnt=0;
	int intdata= atoi(data);
	// food distribute
	conn = connectsql(host,user,pass,dbname);
	insert_query(conn,EMPTYCHECK(),0,intdata,(getprev==0?getprev:(getprev-remainfood<0?0:getprev-remainfood)));

	printf("data updated!!\n");
	return 0;
}
