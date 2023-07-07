#!/usr/bin/env python
from rpi_lcd import LCD
from importlib import import_module
import os
from flask import Flask, render_template, Response, request, send_from_directory
import numpy as np
from board import SCL, SDA
import busio

from adafruit_pca9685 import PCA9685
from adafruit_motor import motor

import time


i2c = busio.I2C(SCL, SDA)


# from signal import signal, SIGTERM, SIGHUP, pause

lcd = LCD()
lcd.clear()
default = "    U o . o U       ]   ^   ["
lcd.text(default[:16], 1)
lcd.text(default[16:], 2)

pca = PCA9685(i2c, address=0x60)
pca.frequency = 100

pca.channels[2].duty_cycle = 0xFFFF
pca.channels[7].duty_cycle = 0xFFFF
motor3 = motor.DCMotor(pca.channels[3], pca.channels[4])
motor4 = motor.DCMotor(pca.channels[5], pca.channels[6])
motor3.decay_mode = (motor.SLOW_DECAY)
motor4.decay_mode = (motor.SLOW_DECAY)


status = {
    "mode": "awake",  # awake, asleep, off
    "direction": "stopped",
    "message": "    U o . o U       ]   ^   ["
}
new_status = {}
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


import socketio

status = {
    "mode": "awake",  # awake, asleep, off
    "direction": "stopped",
    "message": ":)"
}

sio = socketio.Client()


@sio.on('server-message')
def on_server_message(new_status):
    global status
    if not new_status['direction'] == status['direction']:
        if new_status['direction'] in throttles:
            motor3.throttle, motor4.throttle = throttles[new_status['direction']]

    if not new_status['message'] == status['message']:

        lcd.clear()
        text = new_status['message']
        if len(text) > 16:
            t1 = text[:16]
            t2 = text[16:]
            lcd.text(t1, 1)
            lcd.text(t2, 2)
        else:
            lcd.text(new_status['message'], 1)
    status.update(new_status)


@sio.event
def connect():  # heartbeat
    global status
    i = 0
    while i < 1000:
        i += 1
        if status["mode"] == "asleep":
            sio.emit('client-message', status)
            print("zzz")
            sio.sleep(2)
        elif status["mode"] == "awake":
            i += 1
            sio.emit('client-message', status)
            print('Sent to server:', status)
            sio.sleep(0.1)
        else:
            sio.disconnect()
            break
    if i == 1000:
        print("TIMED OUT")
    sio.disconnect()


@sio.event
def disconnect():
    print('Disconnected from server.')

if __name__ == '__main__':
    print("Starting!!")
    sio.connect('http://raysdog.com:8765')
    # sio.connect('http://localhost:8765/')
    sio.wait()
