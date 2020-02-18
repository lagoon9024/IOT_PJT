#include <Ethernet.h>
#include <MySQL_Connection.h>
#include <MySQL_Cursor.h>

byte mac_addr[] = {0xdc,0xa6,0x32,0x70,0xb8,0x56};

IPAddress server_addr(70.12.237.120);
char user[] = "dev1";
char password[] = "1234"; //row password

char INSERT_SQL[] ="INSERT INTO arduino_db VALUES (12,12,"2020-01-28 18:44:00")";

EthernetClient client;
MySQL_Connection conn((Client *)&client);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  while (!Serial); // wait for serial port to connect
  Ethernet.begin(mac_addr);
  Serial.println("Connecting...");
  if (conn.connect(server_addr, 3306, user, password)) {
    delay(1000);
  }
  else
    Serial.println("Connection failed.");
}

void loop() {
  // put your main code here, to run repeatedly:
   delay(2000);

  Serial.println("Recording data.");

  // Initiate the query class instance
  MySQL_Cursor *cur_mem = new MySQL_Cursor(&conn);
  // Execute the query
  cur_mem->execute(INSERT_SQL);
  // Note: since there are no results, we do not need to read any data
  // Deleting the cursor also frees up memory used
  delete cur_mem;
}
