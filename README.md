# ![100%](https://logoeps.com/wp-content/uploads/2011/08/bluetooth-logo-vector.png)

#[fit]  Web Bluetooth
## What the heart wants :heart:

---

##[fit] Why?

![left](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUs-w-SHFMutxLjf5CIlplF5flYUk8yaRL1gXPO2fj7bpcccSzxw)

- Connect to sensors
- Connect to home devices
- Connect to your phone

> Not just web pages, but Electron too!

---

##[fit] Bluetooth 2/3

- Profiles were confusing. Most people just used SPP (serial port profile)
- Painful pairing process
- Too much energy
- Need Apple Certification to connect to iOS

---

##[fit] Bluetooth 4 LE
### (or **BTLE**)

- Uses *much* less energy
- Pairing is easy
- Tons of new profiles
- Can connect with iOS!

---

##[fit] GATT

GATT (General Attribute Profile) defines a protocol for many devices to communicate.

GATT servers must provide:

- Services
- Characteristics

---

###[fit] Services
> A collection of related characteristics.

- *Primary* services are directly related to the device's purpose.
- *Secondary* services are extra.

A heart rate monitor might have a primary heart rate service, and a secondary battery level service.

There are dozens of [pre-defined GATT services](https://www.bluetooth.com/specifications/gatt/services): battery levels, sensor values, data transfer, etc.

---

###[fit] Characteristics

- A characteristic is a single data value that can be read/written.
- A [number of different formats](https://www.bluetooth.com/specifications/assigned-numbers/format-types) (ints, floats, strings, structs).
- [Declarations](https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.attribute.gatt.characteristic_declaration.xml) describe how a characteristic is used.
  - **Write** - can be written to
  - **Read** - can be read any time
  - **Notify** - broadcasts new values (lowest power)

---

##[fit] Web Bluetooth API

- The [web bluetooth API](https://webbluetoothcg.github.io/web-bluetooth/) is a WIP proposal, only really available in Chrome.
- From the browser you can connect connect to and communicate with BTLE devices.
- Promise based, great for `async/await`!

---


#[fit] Web Bluetooth API

```typescript
const device = await navigator.bluetooth.requestDevice({
    filters: [{services: [0x180D]}]
});

const server = await device.gatt!.connect();
const service = await server.getPrimaryService("0000180d-0000-1000-8000-00805f9b34fb");
const characteristic = await service.getCharacteristic("00002a37-0000-1000-8000-00805f9b34fb");
await characteristic.startNotifications();

characteristic.addEventListener('characteristicvaluechanged', parseHeartRate);
```

---

#[fit] DEMO

---

##[fit] Requesting Devices 

```typescript, [.highlight: 1-3]
const device = await navigator.bluetooth.requestDevice({
    filters: [{services: [0x180D]}]
});

const server = await device.gatt!.connect();
const service = await server.getPrimaryService("0000180d-0000-1000-8000-00805f9b34fb");
const characteristic = await service.getCharacteristic("00002a37-0000-1000-8000-00805f9b34fb");
await characteristic.startNotifications();

characteristic.addEventListener('characteristicvaluechanged', parseHeartRate);
```

- Must be the result of a click.

---

##[fit] Connect to GATT

```typescript, [.highlight: 5]
const device = await navigator.bluetooth.requestDevice({
    filters: [{services: [0x180D]}]
});

const server = await device.gatt!.connect();
const service = await server.getPrimaryService("0000180d-0000-1000-8000-00805f9b34fb");
const characteristic = await service.getCharacteristic("00002a37-0000-1000-8000-00805f9b34fb");
await characteristic.startNotifications();

characteristic.addEventListener('characteristicvaluechanged', parseHeartRate);
```

After getting a device, you need to specify you want to use GATT.

---

##[fit] Get a Service

```typescript, [.highlight: 6]
const device = await navigator.bluetooth.requestDevice({
    filters: [{services: [0x180D]}]
});

const server = await device.gatt!.connect();
const service = await server.getPrimaryService("0000180d-0000-1000-8000-00805f9b34fb");
const characteristic = await service.getCharacteristic("00002a37-0000-1000-8000-00805f9b34fb");
await characteristic.startNotifications();

characteristic.addEventListener('characteristicvaluechanged', parseHeartRate);
```

With the GATT server, you can list the services, or get a particular service.

---

##[fit] Get Characteristics

```typescript, [.highlight: 7]
const device = await navigator.bluetooth.requestDevice({
    filters: [{services: [0x180D]}]
});

const server = await device.gatt!.connect();
const service = await server.getPrimaryService("0000180d-0000-1000-8000-00805f9b34fb");
const characteristic = await service.getCharacteristic("00002a37-0000-1000-8000-00805f9b34fb");
await characteristic.startNotifications();

characteristic.addEventListener('characteristicvaluechanged', parseHeartRate);
```

With a service, you can list available characteristics, or get a particular characteristic.

---

##[fit] Retrieving Values

```typescript, [.highlight: 8-10]
const device = await navigator.bluetooth.requestDevice({
    filters: [{services: [0x180D]}]
});

const server = await device.gatt!.connect();
const service = await server.getPrimaryService("0000180d-0000-1000-8000-00805f9b34fb");
const characteristic = await service.getCharacteristic("00002a37-0000-1000-8000-00805f9b34fb");
await characteristic.startNotifications();

characteristic.addEventListener('characteristicvaluechanged', parseHeartRate);
```

This is a **notify** characteristic, so new values are pushed out.

This saves energy because the BTLE client does not have to poll for changes, the server will send them out.

---

##[fit] Retrieving Values

```typescript, [.highlight: 8]
const device = await navigator.bluetooth.requestDevice({
    filters: [{services: [0x180D]}]
});

const server = await device.gatt!.connect();
const service = await server.getPrimaryService("0000180d-0000-1000-8000-00805f9b34fb");
const characteristic = await service.getCharacteristic("00002a37-0000-1000-8000-00805f9b34fb");
const value = await characteristic.readValue();
```

This is a **read** value, allowing you to retreive the current value.

---

##[fit] Write

```typescript, [.highlight: 8]
const device = await navigator.bluetooth.requestDevice({
    filters: [{services: [0x180D]}]
});

const server = await device.gatt!.connect();
const service = await server.getPrimaryService("0000180d-0000-1000-8000-00805f9b34fb");
const characteristic = await service.getCharacteristic("00002a37-0000-1000-8000-00805f9b34fb");
const value = await characteristic.writeValue(12);
```

This is a **write** value, allowing you to write new values.

------

#[fit] What's Next
## for Web Bluetooth

- Better browser support.
- Better Stability - it's a little crashy right now.
- Automatically connect to previously connected devices.

---
#[fit] What's Next
## for **You**

- iOS / Android both let you create GATT servers. Communicate with your phone from your web page.
- Communicate with your BTLE enabled sensors/products from a webpage (sync your fitbit without a phone).
