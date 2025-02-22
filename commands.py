def handle_command(command):
    """Handle incoming commands."""
    if command == "up":
        print("Up arrow key pressed!")
    elif command == "down":
        print("Down arrow key pressed!")
    elif command == "left":
        print("Left arrow key pressed!")
    elif command == "right":
        print("Right arrow key pressed!")
    else:
        print(f"Unknown command: {command}")