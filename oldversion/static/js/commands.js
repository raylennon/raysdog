const buttons = document.querySelectorAll("button");
const pressedKeys = { left: false, up: false, right: false, down: false };

function handlePress(id, down) {
  const button = document.querySelector(`#${id}`);
  if (pressedKeys[id] !== down) {
    pressedKeys[id] = down;
    directionUpdate(id, down);
    button.style.backgroundColor = down ? "darkgrey" : "";
  }
}

buttons.forEach((button) => {
  button.addEventListener("mousedown", () => handlePress(button.id, true));
  button.addEventListener("touchstart", () => handlePress(button.id, true));
  button.addEventListener("mouseup", () => handlePress(button.id, false));
  button.addEventListener("touchend", () => handlePress(button.id, false));
});

document.addEventListener("keydown", (event) => {
  const id = { "ArrowLeft": "left", "ArrowUp": "up", "ArrowRight": "right", "ArrowDown": "down" }[event.key];
  if (id && !pressedKeys[id]) {
    handlePress(id, true);
  }
});

document.addEventListener("keyup", (event) => {
  const id = { "ArrowLeft": "left", "ArrowUp": "up", "ArrowRight": "right", "ArrowDown": "down" }[event.key];
  if (id && pressedKeys[id]) {
    handlePress(id, false);
  }
});

function directionUpdate(id, down) {
  // console.log(`Button ${id} was ${down ? "pressed" : "released"}`);
  // console.log(pressedKeys);
  let dir = ""; const baseUrl = dir;
  if (pressedKeys.left) { dir += "L"; }
  if (pressedKeys.right) { dir += "R"; }
  if (pressedKeys.up) { dir += "U"; }
  if (pressedKeys.down) { dir += "D"; }
  if (dir === baseUrl) { dir += "STOP"; }

  const data = {
    command: 'dir',
    direction: dir
  };

  fetch("/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

const inputBox = document.getElementById('Display');
inputBox.addEventListener('input', () => {
  const data = {
    command: 'display',
    text: inputBox.value
  };
  fetch("/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
});
