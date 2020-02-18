int analogPin = 1;
int ir_receive = 4;
int ir_trans = 3;

int preval;
int val = 0;
void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(ir_receive,INPUT);
  pinMode(ir_trans,OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  val = digitalRead(digitalPin);
  if(preval!=val) Serial.println(val);
  delay(300);
  preval=val;
}
