$( document ).ready(function() {

    // Device
    var address = "10.194.145.32";
    var device = new Device(address);

    // Buttons

    document.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      switch(e.keyCode) {
        case 38:
          device.callFunction("forward"); 
          console.log("Running forward!");
          break;
        case 37:
          device.callFunction("left");
          break;
        case 39:
          device.callFunction("right");
          break;
        case 40:
          device.callFunction("backward");
          break;
      } 
      console.log(e.key);
    });
    $(document).keyup(function(e) {
      device.callFunction("stop");
    });
    $('#forward').mousedown(function() {
      device.callFunction("forward");
      var request = new XMLHttpRequest();
      request.open("GET", "/go_forward", true);
      request.send();
    });
    $('#forward').mouseup(function() {
      device.callFunction("stop");
      var request = new XMLHttpRequest();
      request.open("GET", "/go_stop", true);
      request.send();
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
