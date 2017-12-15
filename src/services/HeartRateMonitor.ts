import Subject from '../Subject';

function parseHeartRate(value: any) {
    // In Chrome 50+, a DataView is returned instead of an ArrayBuffer.
    value = value.buffer ? value : new DataView(value);
    let flags = value.getUint8(0);
    let rate16Bits = flags & 0x1;
    let result: any = {};
    let index = 1;
    if (rate16Bits) {
        result.heartRate = value.getUint16(index, /*littleEndian=*/true);
        index += 2;
    } else {
        result.heartRate = value.getUint8(index);
        index += 1;
    }
    let contactDetected = flags & 0x2;
    let contactSensorPresent = flags & 0x4;
    if (contactSensorPresent) {
        result.contactDetected = !!contactDetected;
    }
    let energyPresent = flags & 0x8;
    if (energyPresent) {
        result.energyExpended = value.getUint16(index, /*littleEndian=*/true);
        index += 2;
    }
    let rrIntervalPresent = flags & 0x10;
    if (rrIntervalPresent) {
        let rrIntervals = [];
        for (; index + 1 < value.byteLength; index += 2) {
            rrIntervals.push(value.getUint16(index, /*littleEndian=*/true));
        }
        result.rrIntervals = rrIntervals;
    }
    return result;
}

export default class HeartRateMonitor {
    private _connection = new Subject<boolean>();
    private _values = new Subject<number>();
    private _errors = new Subject<string>();

    constructor() {
    }

    private onDisconnect() {
        this._connection.next(false);
    }

    private onUpdate(event: any) {
        this._values.next(parseHeartRate(event.target.value).heartRate);
    }

    get connected() {
        return this._connection.asObservable();
    }

    get heartRate() {
        return this._values.asObservable();
    }

    connect() {
        navigator.bluetooth.requestDevice({
            filters: [{services: [0x180D]}]
        }).then(device => {
            device.addEventListener('gattserverdisconnected', this.onDisconnect.bind(this));

            return device.gatt!.connect();
        }).then(server => {
            return server.getPrimaryService("0000180d-0000-1000-8000-00805f9b34fb");
        }).then(service => {
            return service.getCharacteristic("00002a37-0000-1000-8000-00805f9b34fb");
        }).then(characteristic => {
            return characteristic.startNotifications();
        }).then((characteristic) => {
            characteristic.addEventListener('characteristicvaluechanged', this.onUpdate.bind(this));

            this._connection.next(true);
        }).catch(e => {
            this._errors.next(e);
        });
    }
}
