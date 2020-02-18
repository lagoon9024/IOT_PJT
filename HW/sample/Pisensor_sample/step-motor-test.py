import RPi.GPIO as GPIO
import time

def sendSignal() :
    for k in range(4):
        GPIO.output(pins[k], signal[step][k])
        print "GPIO %i" %(pins[k])

GPIO.setmode(GPIO.BCM)
pins = [12,16,20,21] #IN1, IN2, IN3, IN4
for p in pins:
    GPIO.setup(p, GPIO.OUT)
    GPIO.output(p, GPIO.LOW)

FULL_STEP = 4
HALF_STEP = 8

signal_full = [
          [GPIO.HIGH, GPIO.LOW, GPIO.LOW, GPIO.LOW],
          [GPIO.LOW, GPIO.HIGH, GPIO.LOW, GPIO.LOW],
          [GPIO.LOW, GPIO.LOW, GPIO.HIGH, GPIO.LOW],
          [GPIO.LOW, GPIO.LOW, GPIO.LOW, GPIO.HIGH]
          ]

signal_half = [
          [GPIO.HIGH, GPIO.LOW, GPIO.LOW, GPIO.HIGH],
          [GPIO.HIGH, GPIO.LOW, GPIO.LOW, GPIO.LOW],
          [GPIO.HIGH, GPIO.HIGH, GPIO.LOW, GPIO.LOW],
          [GPIO.LOW, GPIO.HIGH, GPIO.LOW, GPIO.LOW],
          [GPIO.LOW, GPIO.HIGH, GPIO.HIGH, GPIO.LOW],
          [GPIO.LOW, GPIO.LOW, GPIO.HIGH, GPIO.LOW],
          [GPIO.LOW, GPIO.LOW, GPIO.HIGH, GPIO.HIGH],
          [GPIO.LOW, GPIO.LOW, GPIO.LOW, GPIO.HIGH],
          ]

#stepping mode and direction
steps = FULL_STEP
signal = signal_full
clockwise = True

try:
    # 1 cycle = 4 step for FULL
    # 1 cycle = 8 step for HALF
    # 1 rev = 512 cycle
    for i in range(512):
        if clockwise :
            for step in range(steps):
                sendSignal()
                time.sleep(0.01)
        else :
            for step in reversed(range(steps)):
                sendSignal()
                time.sleep(0.01)

except KeyboardInterrupt:
    print("\nInterrupted!")

finally:
    GPIO.cleanup()