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
      
        // Check which key or combination of keys was pressed
        if (keysPressed['ArrowUp'] && keysPressed['ArrowLeft']) {
          // Make HTTP request for up and left arrow combination
          console.log('Up and Left arrow combination pressed');
        } else if (keysPressed['ArrowUp'] && keysPressed['ArrowRight']) {
          // Make HTTP request for up and right arrow combination
          console.log('Up and Right arrow combination pressed');
        } else if (keysPressed['ArrowDown'] && keysPressed['ArrowLeft']) {
          // Make HTTP request for down and left arrow combination
          console.log('Down and Left arrow combination pressed');
        } else if (keysPressed['ArrowDown'] && keysPressed['ArrowRight']) {
          // Make HTTP request for down and right arrow combination
          console.log('Down and Right arrow combination pressed');
        } else if (event.key === 'ArrowUp') {
            device.callFunction("forward"); 
            request.open("GET", "/go_forward", true);
        } else if (event.key === 'ArrowDown') {
            device.callFunction("forward"); 
            request.open("GET", "/go_back", true);
        } else if (event.key === 'ArrowRight') {
            device.callFunction("forward"); 
            request.open("GET", "/go_right", true);
        } else if (event.key === 'ArrowLeft') {
            device.callFunction("forward"); 
            request.open("GET", "/go_left", true);
        }
      });
      
      document.addEventListener('keyup', function(event) {
        // Remove the key from the keysPressed object
        delete keysPressed[event.key];
      
        // Check if all keys have been released
        if (Object.keys(keysPressed).length === 0) {
            var request = new XMLHttpRequest();
            request.open("GET", "/go_stop", true);
            request.send();
            device.callFunction("stop");0
        }
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
