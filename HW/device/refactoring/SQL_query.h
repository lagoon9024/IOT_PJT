#include <mysql/mysql.h>

MYSQL* connectsql(char* host, char* user, char* pass, char* dbname);

void error(MYSQL *conn);

MYSQL_ROW get_field(MYSQL *conn);
int get_last_eaten(MYSQL *conn);
void insert_query(MYSQL *conn, int emptyflag, int amount, int remain, int eaten);