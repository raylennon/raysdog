import smbus
import time
channel = 1

#  MCP4725 defaults to address 0x60
address = 0x60

# Initialize I2C (SMBus)
bus = smbus.SMBus(channel)

# Create a sawtooth wave 16 times
for i in range(16):

    bus.write_byte_data(address, i, 0)
    bus.write_byte_data(address, i+1, 0xFF)
    time.sleep(1000)