import smbus
import time
channel = 1

#  MCP4725 defaults to address 0x60
address = 0x60

# Initialize I2C (SMBus)
bus = smbus.SMBus(channel)

print("writing...")
for i in range(0x40,0x40+50):
    print(i)
    bus.write_byte_data(address, i, 0)
    bus.write_byte_data(address, i+1, 0xFF)
    time.sleep(0.5)