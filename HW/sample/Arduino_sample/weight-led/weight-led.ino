//sensorpin은 센서에 압력센서에 연결한 아날로그 핀(0번)
int sensorPin = 0;
//ledPin은 LED에 견결한 핀(9번)
//int ledPin = 9;
 
void setup( ){
 
   //시리얼 통신 속도 설정
  Serial.begin(9600);
  //ledPin을 출력으로 설정
  //pinMode(ledPin, OUTPUT);
 
}
 
void loop( ){
 
  //센서 값을 읽어 들인다
  int value = analogRead(sensorPin);
  //읽어 들인 값으로 LED의 밝기를 구하고 LED의 밝기 바꿈
  int intensity = map(value, 0, 1023, 0, 255);
  //압력센서값을 시리얼 모니터로 출력
  Serial.println(value);
  //analogWrite(ledPin, intensity);
  //10ms 동안 대기
  delay(10);
 
}
