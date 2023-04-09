$( document ).ready(function() {

    // Device
    var address = "10.194.145.32";
    var device = new Device(address);

    // Buttons

    document.addEventListener('keydown', function(event) {

        if (event.repeat) return;
        var request = new XMLHttpRequest();

        // Add the key to the keysPressed object
        keysPressed[event.key] = true;
        console.log(event.key);
        // Check which key or combination of keys was pressed
        if (keysPressed['ArrowUp'] && keysPressed['ArrowLeft']) {
            request.open("GET", "/go_fl", true);
        } else if (keysPressed['ArrowUp'] && keysPressed['ArrowRight']) {
            request.open("GET", "/go_fr", true);
        } else if (keysPressed['ArrowDown'] && keysPressed['ArrowLeft']) {
            request.open("GET", "/go_bl", true);
        } else if (keysPressed['ArrowDown'] && keysPressed['ArrowRight']) {
            request.open("GET", "/go_br", true);
        } else if (event.key === 'ArrowUp') {
            request.open("GET", "/go_forward", true);
            console.log("Forward ho!!");
        } else if (event.key === 'ArrowDown') {
            request.open("GET", "/go_back", true);
        } else if (event.key === 'ArrowRight') {
            request.open("GET", "/go_right", true);
        } else if (event.key === 'ArrowLeft') {
            request.open("GET", "/go_left", true);
        }
        request.send();

      });
      
      document.addEventListener('keyup', function(event) {
        // Remove the key from the keysPressed object
        var request = new XMLHttpRequest();
        delete keysPressed[event.key];
        if (True){//Object.keys(keysPressed).length === 0) {
            var request = new XMLHttpRequest();
            request.open("GET", "/go_stop", true);
            request.send();
            device.callFunction("stop");
            return
        }

        console.log(event.key);
        // Check which key or combination of keys was pressed
        if (keysPressed['ArrowUp'] && keysPressed['ArrowLeft']) {
            request.open("GET", "/go_fl", true);
        } else if (keysPressed['ArrowUp'] && keysPressed['ArrowRight']) {
            request.open("GET", "/go_fr", true);
        } else if (keysPressed['ArrowDown'] && keysPressed['ArrowLeft']) {
            request.open("GET", "/go_bl", true);
        } else if (keysPressed['ArrowDown'] && keysPressed['ArrowRight']) {
            request.open("GET", "/go_br", true);
        } else if (event.key === 'ArrowUp') {
            request.open("GET", "/go_forward", true);
            console.log("Forward ho!!");
        } else if (event.key === 'ArrowDown') {
            request.open("GET", "/go_back", true);
        } else if (event.key === 'ArrowRight') {
            request.open("GET", "/go_right", true);
        } else if (event.key === 'ArrowLeft') {
            request.open("GET", "/go_left", true);
        }
        request.send();
        // Check if all keys have been released

      });
    // document.addEventListener('keydown', (e) => {
    //   if (e.repeat) return;
    //   var request = new XMLHttpRequest();
    //   switch(e.keyCode) {
    //     case 38:
    //       device.callFunction("forward"); 
    //       request.open("GET", "/go_forward", true);
    //       break;
    //     case 37:
    //       device.callFunction("left");
    //       request.open("GET", "/go_left", true);
    //       break;
    //     case 39:
    //       device.callFunction("right");
    //       request.open("GET", "/go_right", true);
    //       break;
    //     case 40:
    //       device.callFunction("backward");
    //       request.open("GET", "/go_back", true);
    //       break;
    // } 
    //   request.send();
    //   console.log(e.key);
    // });
    // $(document).keyup(function(e) {
    //   var request = new XMLHttpRequest();
    //   request.open("GET", "/go_stop", true);
    //   request.send();
    //   device.callFunction("stop");0
    // });
});


var keysPressed = {}; // Keep track of which keys are currently pressed
