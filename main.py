from flask import Flask, Response
from picamera2 import Picamera2
import time

app = Flask(__name__)

# Initialize the camera
picam2 = Picamera2()
# Configure the camera for video capture
video_config = picam2.create_video_configuration(main={"size": (640, 480)})
picam2.configure(video_config)
picam2.start()

def generate_frames():
    while True:
        # Capture a frame from the camera
        frame = picam2.capture_array()
        # Convert the frame to JPEG format
        ret, jpeg = cv2.imencode('.jpg', frame)
        if not ret:
            break
        # Yield the frame as a byte stream
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')
        time.sleep(0.1)  # Add a small delay to control frame rate

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)