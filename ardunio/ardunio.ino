//https://youtu.be/ZAcpYT4nm6E

// pins for the LEDs:
const int redPin = 7;
const int greenPin = 6;
const int bluePin = 5;
const int joyX = A0; 
const int joyY = A1; 
const int SWPin = 2;

int buttonState = 1;

void setup() {
  // initialize serial:
  Serial.begin(9600);
  // make the pins outputs:
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  pinMode(joyX, INPUT); 
  pinMode(joyY, INPUT); 
  pinMode(SWPin, INPUT);
  digitalWrite(SWPin, HIGH); 
}

void loop() {
  // if there's any serial available, read it:

  while (Serial.available() > 0) {
    //buttonState = digitalRead(SWPin);

    int xValue = analogRead(joyX);
    int yValue = analogRead(joyY);
    int red = Serial.parseInt();
    int green = Serial.parseInt();
    int blue = Serial.parseInt();
   
    Serial.print(xValue);
    Serial.print(",");
    Serial.print(yValue);
    Serial.print(",");
    Serial.println(digitalRead(SWPin));
    delay(50);
    if (Serial.read() == '\n') {
      red = 255 - constrain(red, 0, 255);
      green = 255 - constrain(green, 0, 255);
      blue = 255 - constrain(blue, 0, 255);
      analogWrite(redPin, red);
      analogWrite(greenPin, green);
      analogWrite(bluePin, blue);
    }
    
  }
}
