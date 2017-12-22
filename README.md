# Web Bluetooth
## What the heart wants :heart:

---

## How is it different?
### Bluetooth 2

- Profiles were confusing. Most people just used SPP (serial port profile)
- Painful pairing process
- Too much energy
- Need Apple Certification to connect to iOS

---

## How is it different?
### Bluetooth 4 LE

- Uses much less energy
- Pairing is easy
- Tons of new profiles
- Can connect with iOS!

---

## GATT

GATT (General Attribute Profile) defines a protocol for many devices to communicate.

GATT servers must provide:

- Services
- Characteristics

---

### Characteristics

A characteristic is a single value that can be read/written.

### Services

A collection of characteristics

---

### GATT Services

There are dozens of [pre-defined GATT services](https://www.bluetooth.com/specifications/gatt/services).

- Battery level
- Sensors: blood pressure, weight, heart rate, HID, cycling metrics, temperature
- Data transfer

Plus you can make your own custom profiles over GATT

---

# Bluetooth in the Browser
##[fit] `navigator.bluetooth`

---



## Web Bluetooth API

- The [web bluetooth API](https://webbluetoothcg.github.io/web-bluetooth/) is a WIP proposal, only really available in Chrome.
- From the browser you can connect connect to and communicate with BTLE devices.

---



#[fit] DEMO

---



## Requesting Devices

### [fit]`navigator.bluetooth.requestDevice`

Connect to a bTLE device.

- Must be a result of a click event.
- Can pass in filters to find devices with specific names or services.
- Returns a `Promise` to the chosen device.

---

## Requesting Devices

```typescript
const device = await navigator.bluetooth.requestDevice({
  filters: [
    { service: 'heart_rate' }
  ]
});
```

- Will throw an error if user clicks cancel

---

## Specify GATT

After getting a device, you need to specify you want to use GATT.

```typescript
const server = await device.getGATTServer();
```

---

## Get a Service

With the GATT server, you can list the services, or get a particular service.

```typescript
const heartRateService = await server.getService('heart_rate');
```

---

## Get Characteristics

With a service, you can list available characteristics, or get a particular characteristic.

```typescript
const heartRateCharacteristic = await service.getCharacteristic('0x180d');
```

---

## Read/Write/Notify

With a characteristic you can

- *Read* values
- *Write* values
- Get *Notified* of value changes

A characteristic can support any of these. For example the heart rate characteristic cannot be read or written, but can be listened to.

---

### Read
#### Read the current value of a characteristic

```typescript
const value = await batteryLevel.value();
```

For example you could read the current value of the battery level of a device.

---

### Write

```typescript
await batteryLevel.write('123');
```
---

### Notify

Be notified of value changes. This saves energy because the BT client does not have to poll for changes, the server will send them out.

```typescript
heartRateCharacteristic.addEventListener('characteristicvaluechanged', event => {
  doSomethingWith(event.target.value);
})
```

---

#[fit] What's Next
## For Web Bluetooth

---

#[fit] What's next for Web Bluetooth

- Better browser support
- Better Stability
- Connect to previouslly connected devices

