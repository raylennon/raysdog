import socketio

status = {
    "mode": "awake", # awake, asleep, off
    "direction": "stopped",
    "message": ":)"
}

sio = socketio.Client()

@sio.on('server-message')
def on_server_message(message):
    global status
    print('Received from server:', message)
    status.update(message)

N=500

@sio.event
def connect(): # heartbeat
    global status
    i=0
    for _ in range(N):
        i+=1
        if status["mode"] == "asleep":
            sio.emit('client-message', status)
            # print("zzz")
            sio.sleep(2)
        elif status["mode"] == "awake":
            i+=1
            sio.emit('client-message', status)
            # print('Sent to server:', status)
            sio.sleep(0.1)
        elif status["mode"] == "off":
            sio.disconnect()
            break
        else:
            print(f"What the hell? -> {status['mode']}")
    else:
        print("TIMED OUT")
    sio.disconnect()


@sio.event
def disconnect():
    print('Disconnected from server.')


sio.connect('http://raysdog.com:8765')
# sio.connect('http://localhost:8765/')
sio.wait()