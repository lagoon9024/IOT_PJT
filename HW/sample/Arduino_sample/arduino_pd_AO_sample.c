// Programa : Sensor de vibracao com LCD 16x2
// Autor : Arduino e Cia

#include <LiquidCrystal.h>

// Porta ligada ao pino A0 do sensor de vibracao
int porta_A0 = A5;
// Porta ligada ao pino D0 do sensor de vibracao
int porta_D0 = 7;

int leitura_analogica = 0;
int leitura_analogica_ant = 0;
int leitura_digital = 0;

// Define os pinos de ligacao ao LCD
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

void setup()
{
  lcd.begin(16,2); //Inicializa LCD
  lcd.clear();     //Limpa o LCD
  pinMode(porta_A0, INPUT);
  pinMode(porta_D0, INPUT);
  //Informacoes iniciais no LCD
  lcd.setCursor(0,0);
  lcd.print("Sensor: OFF.");
  lcd.setCursor(0,1);
  lcd.print("Level : ");
  Serial.begin(9600);
}

void loop()
{
  // Leitura dos dados das portas do sensor
  leitura_analogica = analogRead(porta_A0);
  leitura_digital = digitalRead(porta_D0);
  // Exibe os dados da porta digital (se houver alteracao), e 
  // nivel de vibracao
  if (leitura_digital != 1)
  {
    lcd.setCursor(8,0);
    lcd.print("Light");
    lcd.setCursor(8,1);
    lcd.print("      ");
    lcd.setCursor(8,1);
    lcd.print(leitura_analogica);
    leitura_analogica_ant = leitura_analogica;
    delay(1000);
    lcd.setCursor(8,0);
    lcd.print("         ");
    lcd.setCursor(8,0);
    lcd.print("OFF.");
   }
  // Exibe os dados do nivel de vibracao
  if (leitura_analogica != leitura_analogica_ant)
  {
    lcd.setCursor(8,1);
    lcd.print("      ");
    lcd.setCursor(8,1);
    lcd.print(leitura_analogica);
    leitura_analogica_ant = leitura_analogica;
  }
  delay(100);
}