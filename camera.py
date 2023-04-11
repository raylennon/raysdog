import os
import io
import cv2
from base_camera import BaseCamera
from picamera.array import PiRGBArray
from picamera import PiCamera
import numpy as np
import time
from datetime import datetime

res = 30

class Camera(BaseCamera):
    video_source = 0

    def __init__(self):
        if os.environ.get('OPENCV_CAMERA_SOURCE'):
            Camera.set_video_source(int(os.environ['OPENCV_CAMERA_SOURCE']))
        super(Camera, self).__init__()
    
    @staticmethod
    def set_resolution(val):
        global res
        res = val
        return 0
    
    @staticmethod
    def set_video_source(source):
        Camera.video_source = source

    @staticmethod
    def frames():
        global res
        camera = cv2.VideoCapture(-1, cv2.CAP_V4L)
        camera.set(cv2.CAP_PROP_BUFFERSIZE, 2)
        # camera.set(3, 640)
        # camera.set(4, 480)
        if not camera.isOpened():
            raise RuntimeError('Could not start camera.')

        while True:
            _, img = camera.read()
            # time.sleep(1)
            scale_percent = res # percent of original size
            width = int(img.shape[1] * scale_percent / 100)
            height = int(img.shape[0] * scale_percent / 100)
            dim = (width, height)
            img = cv2.resize(img, dim, interpolation = cv2.INTER_AREA)
            img = cv2.rotate(img, cv2.ROTATE_180)
            # encode as a jpeg image and return it
            yield cv2.imencode('.jpg', img)[1].tobytes()