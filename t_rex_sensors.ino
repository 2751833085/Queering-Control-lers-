//variables
const int photoPin = A1;
int lightValue = 0;
int roomValue = 0;


const int jumpThreshold = 150;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  //read original value
  roomValue = analogRead(photoPin);
}

void loop() {
  // put your main code here, to run repeatedly:

  //photoresistor current value reading
  lightValue = analogRead(photoPin);

  Serial.print("Light Value: ");
  Serial.println(lightValue);

  //take overall light value, based on overall value...if light value changes by X amount, print "jump!"

  if ((lightValue - roomValue) >= jumpThreshold) {
    
    Serial.println("Jump Detected LES GOOOO!");

  }

  delay(1500);
}
