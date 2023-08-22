import asyncio
import socketio

sio = socketio.AsyncClient()

import platform
debug = (platform.platform()[0:7]=="Windows")

frame_interval=1/1

if not debug:
    from rpi_lcd import LCD
    from board import SCL, SDA
    import busio
    from adafruit_pca9685 import PCA9685
    from adafruit_motor import motor

    i2c = busio.I2C(SCL, SDA)

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
    # "mode": "awake",
    "direction": "STOP",
    "message": ":)"
}

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

connection_event = asyncio.Event()


@sio.event
async def connect():
    print('Connection established')
    await sio.emit('chat message', 'Hello from Python!')
    connection_event.set()  # Set the event to signal connection is ready

@sio.on('user command')
def handle_update(data):
    global status
    print("Received message:", data)
    if not debug:
        if 'direction' in data:
            if not data['direction'] == status['direction']:
                if data['direction'] in throttles:
                    motor3.throttle, motor4.throttle = throttles[data['direction']]
        if 'message' in data:
            if not data['message'] == status['message']:
                print("MESSAGE UPDATE")
                lcd.clear()
                text = data['message']
                if len(text) > 16:
                    t1 = text[:16]
                    t2 = text[16:]
                    lcd.text(t1, 1)
                    lcd.text(t2, 2)
                else:
                    lcd.text(data['message'], 1)
    status.update(data)

async def send_camera_feed():

    await connection_event.wait()

    import time
    import cv2
    import base64
    camera = cv2.VideoCapture(0)

    while True:
        start_time = time.time()  # Record the start time of frame processing
        ret, frame = camera.read()
        if not ret:
            break

        # Encode the frame as JPEG
        _, buffer = cv2.imencode('.jpg', frame)
        encoded_image = base64.b64encode(buffer).decode('utf-8')

        await sio.emit('camera frame', encoded_image)  # Emit the encoded frame
        print("sent")
        await sio.emit('camera frame', {12:12})  # Emit the encoded frame
        print("sent, but weird")
        elapsed_time = time.time() - start_time
        await asyncio.sleep(max(0, frame_interval - elapsed_time))

@sio.event
async def disconnect():
    print('disconnected from server')

async def main():
    while True:
        try:
            await sio.connect('http://raysdog.com:80')
            # await sio.connect('http://lacolhost.com')
            send_camera_task = asyncio.create_task(send_camera_feed())
            await send_camera_task
            await sio.wait()
        except socketio.exceptions.ConnectionError:
            print('Connection error occurred. Retrying...')
            await asyncio.sleep(5)  # Wait before attempting reconnection

if __name__ == '__main__':
    asyncio.run(main())