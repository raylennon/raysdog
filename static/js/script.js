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
          device.callFunction("forward"); 
          console.log("Running forward!");
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
    $('#forward').mousedown(function() {
      device.callFunction("forward");
    });
    $('#forward').mouseup(function() {
      device.callFunction("stop");
    });

    $('#right').mousedown(function() {
      device.callFunction("right");
    });
    $('#right').mouseup(function() {
      device.callFunction("stop");
    });

    $('#left').mousedown(function() {
      device.callFunction("left");
    });
    $('#left').mouseup(function() {
      device.callFunction("stop");
    });

    $('#backward').mousedown(function() {
      device.callFunction("backward");
    });
    $('#backward').mouseup(function() {
      device.callFunction("stop");
    });

});
