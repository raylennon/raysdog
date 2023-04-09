$( document ).ready(function() {

    // Device
    var address = "10.194.145.32";
    var device = new Device(address);

    // Buttons

    document.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      var request = new XMLHttpRequest();
      switch(e.keyCode) {
        case 38:
          // device.callFunction("forward"); 
          request.open("GET", "/go_forward", true);
          break;
        case 37:
          device.callFunction("left");
          request.open("GET", "/go_left", true);
          break;
        case 39:
          device.callFunction("right");
          request.open("GET", "/go_right", true);
          break;
        case 40:
          device.callFunction("backward");
          request.open("GET", "/go_back", true);
          break;
    } 
      request.send();
      console.log(e.key);
    });
    $(document).keyup(function(e) {
      var request = new XMLHttpRequest();
      request.open("GET", "/go_stop", true);
      request.send();
      device.callFunction("stop");0
    });
});
