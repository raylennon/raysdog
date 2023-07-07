#!/usr/bin/env python
from importlib import import_module
import os

if os.environ.get('CAMERA'):
    Camera = import_module('camera_' + os.environ['CAMERA']).Camera
else:
    from camera import Camera

import numpy as np
from board import SCL, SDA
import busio

from adafruit_pca9685 import PCA9685
from adafruit_motor import motor

import time


import logging

secure = False

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

i2c = busio.I2C(SCL, SDA)


from signal import signal, SIGTERM, SIGHUP, pause
from rpi_lcd import LCD
lcd = LCD()
lcd.clear()
default = "    U o . o U       ]   ^   ["
lcd.text(default[:16],1)
lcd.text(default[16:],2)

pca = PCA9685(i2c, address=0x60)
pca.frequency = 100

pca.channels[2].duty_cycle = 0xFFFF
pca.channels[7].duty_cycle = 0xFFFF
motor3 = motor.DCMotor(pca.channels[3], pca.channels[4])
motor4 = motor.DCMotor(pca.channels[5], pca.channels[6])
motor3.decay_mode = (motor.SLOW_DECAY)
motor4.decay_mode = (motor.SLOW_DECAY)

app = Flask(__name__)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

import random
pin = random.randint(1000, 9999)


def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

last_request_time = 0
delay = 0.3  # set the desired delay between requests in seconds


@app.route("/webhook", methods=["POST"])
def handle_webhook():
    data = request.get_json()
    if (data['command'] == "dir"):
        throttles = {
            "STOP": (0, 0),
            "U": (1, 1),
            "D": (-1, -1),
            "R": (1, -1),
            "L": (-1, 1),
            "RU": (1, 0.2),
            "LU": (0.2, 1),
            "RD": (-0.2, -1),
            "LD": (-1, -0.2)
        }
        if data['direction'] in throttles:
            motor3.throttle, motor4.throttle = throttles[data['direction']]
        return "", 204
    elif (data['command'] == 'display'):

        global last_request_time
        current_time = time.monotonic()
        time_since_last_request = current_time - last_request_time
        
        if time_since_last_request < delay:
            return "",204

        lcd.clear()
        text = data['text']
        if len(text)>16:
            t1 = text[:16]
            t2 = text[16:]
            lcd.text(t1, 1)
            lcd.text(t2,2)
        else:
            lcd.text(data['text'],1)
        
        last_request_time = current_time


        return "", 204


@app.route('/video_feed')
def video_feed():
    return Response(gen(Camera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    print("Starting!!")
    print(f'Current PIN: {pin}')
    app.run(host='0.0.0.0', threaded=True, port=80)
