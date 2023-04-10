$( document ).ready(function() {

    // Device
    var address = "10.194.145.32";
    var device = new Device(address);

    // Buttons

    document.addEventListener('keydown', function(event) {

        // if (event.repeat) return;
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
        if (Object.keys(keysPressed).length === 0) {
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
        } else if (keysPressed['ArrowUp']) {
            request.open("GET", "/go_forward", true);
            console.log("Forward ho!!");
        } else if (keysPressed['ArrowDown']) {
            request.open("GET", "/go_back", true);
        } else if (keysPressed['ArrowRight']) {
            request.open("GET", "/go_right", true);
        } else if (keysPressed['ArrowLeft']) {
            request.open("GET", "/go_left", true);
        }
        request.send();
      });
});


var keysPressed = {}; // Keep track of which keys are currently pressed


document.getElementById("Resolution").addEventListener("change", updateresolution);

function updateresolution() {
  console.log("WHAT!!")
  var res = document.getElementById("Resolution");
  var val = res.value;
  var request = new XMLHttpRequest();
  request.open("GET", "/res_"+val, true);
  request.send();
}