#include "SQL_query.h"

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <time.h>
#include <mysql/mysql.h>

MYSQL* connectsql(char* host, char* user, char* pass, char* dbname){
	MYSQL *conn;
	conn = mysql_init(NULL);
	conn =mysql_real_connect(conn, host, user, pass, dbname, 0, NULL, 0);
	if (!conn)
	{
		fprintf(stderr, "ERROR: %s[%d]\n", mysql_error(conn), mysql_errno(conn));
		exit(1);
	}
	else{
		printf("Connection Successful!\n\n");
		return conn;
	}
}

void error(MYSQL *conn){
	fprintf(stderr, "%s\n", mysql_error(conn));
	mysql_close(conn);
}

MYSQL_ROW get_field(MYSQL *conn){	
	char tbuf[1024];
	time_t restime=time(NULL);
	sprintf(tbuf, "%d:%d:00", localtime(&restime)->tm_hour, localtime(&restime)->tm_min);
	mysql_query(conn, "select * from local_timetable");
	MYSQL_RES *result = mysql_store_result(conn);
	MYSQL_ROW row;
	while((row = mysql_fetch_row(result))){
		if(strcmp(row[0],tbuf)==0) return row;
	}
	return row;
}

int get_last_eaten(MYSQL *conn){
	mysql_query(conn, "select amount, remain from local_feeding_log order by _datetime desc limit 1");
	int preveaten=0;
	MYSQL_RES *result = mysql_store_result(conn);
	MYSQL_ROW row;
	if(row = mysql_fetch_row(result)){
		preveaten = atoi(row[0])+atoi(row[1]);
		return preveaten;
	}
	return 0;
}

void insert_query(MYSQL *conn, int emptyflag, int amount, int remain, int eaten){
	char buf[1024];
	sprintf(buf, "insert into local_feeding_log (empty, amount, remain, eaten) values ('%d', '%d', '%d', '%d')", emptyflag, amount, remain, eaten);
	int res = mysql_query(conn, buf);
	if (!res)
		printf("Insert <%d> <%d> <%d> <%d> successful!\n", emptyflag, amount, remain, eaten);
	else
		error(conn);
}