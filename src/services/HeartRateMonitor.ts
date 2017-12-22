import Subject from '../Subject';
import Observable from "@dojo/core/Observable";

export enum HeartRateMonitorConnectionState {
    LookingForDevice = 0,
    Connecting,
    Connected
}

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
    private _values = new Subject<number>();

    constructor() {
    }

    private onUpdate(event: any) {
        this._values.next(parseHeartRate(event.target.value).heartRate);
    }

    get heartRate() {
        return this._values.asObservable();
    }

    connect() {
        const self = this;

        return new Observable<HeartRateMonitorConnectionState>(subscription => {
            subscription.next(HeartRateMonitorConnectionState.LookingForDevice);

            (async function() {
                try {
                    const device = await navigator.bluetooth.requestDevice({
                        filters: [{services: [0x180D]}]
                    });

                    device.addEventListener('gattserverdisconnected', () => {
                        subscription.complete();
                    });

                    subscription.next(HeartRateMonitorConnectionState.Connecting);

                    const server = await device.gatt!.connect();
                    const service = await server.getPrimaryService("0000180d-0000-1000-8000-00805f9b34fb");
                    const characteristic = await service.getCharacteristic("00002a37-0000-1000-8000-00805f9b34fb");
                    await characteristic.startNotifications();

                    characteristic.addEventListener('characteristicvaluechanged', self.onUpdate.bind(self));
                    subscription.next(HeartRateMonitorConnectionState.Connected);
                } catch (e) {
                    subscription.error(e);
                }
            })();
        });
    }
}
