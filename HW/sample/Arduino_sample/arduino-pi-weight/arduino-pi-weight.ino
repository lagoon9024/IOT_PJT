char send_signal = '0';

int weight_pin = 0;
int weight_value;

void setup(){
  Serial.begin(9600);
}

void loop(){
  if(Serial.available()){
    send_signal = Serial.read();
  }
  
  if(send_signal == '1') { //if send_signal on
   //Serial.write(sensor_value[0]);
   //Serial.write(sensor_value[1]);
   //Serial.write(weight_value);
   Serial.print("Encoded Weight Value : ");
   Serial.println(weight_value);
   send_signal = '0';
  }
  
  //sensor_value[0] += 2;
  //sensor_value[1] = random(1,1000);
  //weight_value = random(1,1000);
  weight_value = analogRead(weight_pin);
}
