int led_green = 7;
int led_red = 6;

long on_red = 2000;
long off_red = 1000;

long on_green = 3000;
long off_green = 1000;

bool flag_start = true;

unsigned long currentMillis;
unsigned long red_start;
unsigned long green_start;
  
void digitalWriteReverse(int pin) {
  if (digitalRead(pin) == HIGH){
    digitalWrite(pin,LOW);
  }
  else {
    digitalWrite(pin,HIGH);
  }
}

void setup() {
  // put your setup code here, to run once:
  pinMode(led_green, OUTPUT);
  pinMode(led_red,OUTPUT);
  Serial.begin(9600);
}

void loop() {

  if (flag_start == true) {//첫 루프일 경우
    currentMillis = millis();
    red_start = currentMillis;
    green_start = currentMillis;
    flag_start = false;
  }
  else {
    currentMillis = millis();
  }
  //빨간거 체크
  if(digitalRead(led_red) == HIGH) { //켜져 있는 경우
    if(currentMillis - red_start > on_red){
      digitalWriteReverse(led_red);
      red_start = currentMillis;
    }
  }
  else { //꺼져 있는 경우
    if(currentMillis - red_start > off_red) {
      digitalWriteReverse(led_red);
      red_start = currentMillis;
    }
  }

  //초록색 체크
  if(digitalRead(led_green) == HIGH) { //켜져 있는 경우
    if(currentMillis - green_start > on_green){
      digitalWriteReverse(led_green);
      green_start = currentMillis;
    }
  }
  else { //꺼져 있는 경우
    if(currentMillis - green_start > off_green) {
      digitalWriteReverse(led_green);
      green_start = currentMillis;
    }
  }
}
