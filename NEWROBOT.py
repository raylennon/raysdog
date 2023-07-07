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

@sio.event
def connect(): # heartbeat
    global status
    i=0
    while i<1000:
        i+=1
        if status["mode"] == "asleep":
            sio.emit('client-message', status)
            print("zzz")
            sio.sleep(2)
        elif status["mode"] == "awake":
            i+=1
            sio.emit('client-message', status)
            print('Sent to server:', status)
            sio.sleep(0.01)
        else:
            sio.disconnect()
            break
    if i==1000:
        print("TIMED OUT")
    sio.disconnect()


@sio.event
def disconnect():
    print('Disconnected from server.')


# sio.connect('http://raysdog.com:8765')
sio.connect('http://localhost:8765/')
sio.wait()