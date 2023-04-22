#!/usr/bin/env python
from importlib import import_module
import os
from flask import Flask, render_template, Response, request

if os.environ.get('CAMERA'):
    Camera = import_module('camera_' + os.environ['CAMERA']).Camera
else:
    from camera import Camera

import numpy as np
from board import SCL, SDA
import busio

from adafruit_pca9685 import PCA9685
from adafruit_motor import motor

i2c = busio.I2C(SCL, SDA)

pca = PCA9685(i2c, address=0x60)
pca.frequency = 100

pca.channels[2].duty_cycle = 0xFFFF
pca.channels[7].duty_cycle = 0xFFFF
motor3 = motor.DCMotor(pca.channels[3], pca.channels[4])
motor4 = motor.DCMotor(pca.channels[5], pca.channels[6])
motor3.decay_mode = (motor.SLOW_DECAY)
motor4.decay_mode = (motor.SLOW_DECAY)

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index2.html')


def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route("/webhook", methods=["POST"])
def handle_webhook():
    data = request.get_json()
    if (data['command'] == "dir"):
        throttles = {
            "STOP": (0, 0),
            "U": (1, 1),
            "D": (-1, -1),
            "L": (1, -1),
            "R": (-1, 1),
            "LU": (1, 0.2),
            "RU": (0.2, 1),
            "LD": (-0.2, -1),
            "RD": (-1, -0.2)
        }
        if data['direction'] in throttles:
            motor3.throttle, motor4.throttle = throttles[data['direction']]
    return "", 204


@app.route('/video_feed')
def video_feed():
    return Response(gen(Camera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    app.run(host='0.0.0.0', threaded=True, port=80)
