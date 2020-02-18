int analogPin = 1;
int digitalPin = 4;

int preval;
int val = 0;
void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(digitalPin,INPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  //val = analogRead(analogPin);
  
  val = digitalRead(digitalPin);
  if(preval!=val) Serial.println(val);
  delay(300);
  preval=val;
}
