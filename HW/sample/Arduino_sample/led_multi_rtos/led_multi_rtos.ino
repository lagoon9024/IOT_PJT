//FreeRTOS로 하나만 껐다켰다 해보기

#include <FreeRTOS_AVR.h>

int led_red = 6;
int led_green = 7;

SemaphoreHandle_t sem;

//red LED 끄기
static void red_off(void *arg){
  while(1){
    xSemaphoreTake(sem,portMAX_DELAY);

    digitalWrite(led_red,LOW);
  }
}

//red LED켜기
static void red_on(){
  pinMode(led_red,OUTPUT);

  while(1) {
    digitalWrite(led_red,HIGH);

    vTaskDelay((200L*configTICK_RATE_HZ)/1000L);

    xSemaphoreGive(sem);

    vTaskDelay((200L*configTICK_RATE_HZ)/1000L);
    
  }
}

//green LED 끄기
static void green_off(void *arg){
  while(1){
    xSemaphoreTake(sem,portMAX_DELAY);

    digitalWrite(led_green,LOW);
  }
}

//green LED켜기
static void green_on(){
  pinMode(led_green,OUTPUT);

  while(1) {
    digitalWrite(led_green,HIGH);

    vTaskDelay((400L*configTICK_RATE_HZ)/1000L);

    xSemaphoreGive(sem);

    vTaskDelay((400L*configTICK_RATE_HZ)/1000L);
    
  }
}


void setup() {
   portBASE_TYPE rs1,rs2,gs1,gs2;

  Serial.begin(9600);
  
  //세마포어를 초기화 합니다. 세마포어는 동시에 1개만 생성됩니다.
  sem = xSemaphoreCreateCounting(1, 0);

  //우선순위가 1인 thread1을 생성합니다.
  rs1 = xTaskCreate(red_on, NULL, configMINIMAL_STACK_SIZE, NULL, 1, NULL);

  //우선순위가 3인 thread2를 생성합니다.
  rs2 = xTaskCreate(red_off, NULL, configMINIMAL_STACK_SIZE, NULL, 1, NULL);

  //우선순위가 2인 thread1을 생성합니다.
  gs1 = xTaskCreate(green_on, NULL, configMINIMAL_STACK_SIZE, NULL, 2, NULL);

  //우선순위가 4인 thread2를 생성합니다.
  gs2 = xTaskCreate(green_off, NULL, configMINIMAL_STACK_SIZE, NULL, 2, NULL);

  // 세마포어,스레드 생성에 에러가 생길 경우 에러메시지 출력
  if (sem== NULL || rs1 != pdPASS || rs2 != pdPASS ) {
    Serial.println(F("Creation problem"));
    while(1);
  }
  //스케쥴러를 시작합니다.
  vTaskStartScheduler();
  Serial.println(F("Insufficient RAM"));
  while(1);
}

void loop() {
  // put your main code here, to run repeatedly:

}
