void setup(){
       Serial.begin(9600);
} 

void loop(){
      char SerialValue;
      if(Serial.available())
      {
           SerialValue=Serial.read();
           if(SerialValue=='Y'){
                  Serial.write("Got Y");
           }
     }
}
