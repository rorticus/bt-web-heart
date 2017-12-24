import {v, w} from '@dojo/widget-core/d';
import {ThemeableMixin, theme} from '@dojo/widget-core/mixins/Themeable';
import {WidgetBase} from '@dojo/widget-core/WidgetBase';
import {HeartRateDisplay} from './HeartRateDisplay';

import * as css from './styles/Application.m.css';
import HeartRateMonitor, {HeartRateMonitorConnectionState} from "../services/HeartRateMonitor";
import EKGDisplay from "./EKGDisplay";

const monitor = new HeartRateMonitor();

@theme(css)
export class Application extends ThemeableMixin(WidgetBase) {
    private _lastHeartRate: number = 0;
    private _connected = false;
    private _connecting = false;

    constructor() {
        super();

        monitor.heartRate.subscribe(heartRate => {
            this._lastHeartRate = heartRate;
            console.log(heartRate);
            this.invalidate();
        });
    }

    connect() {
        monitor.connect().subscribe(state => {
            if (state === HeartRateMonitorConnectionState.Connecting) {
                this._connecting = true;
                this.invalidate();
            } else if (state === HeartRateMonitorConnectionState.Connected) {
                this._connecting = false;
                this._connected = true;
                this.invalidate();
            }
        }, e => {
            this._connecting = false;
            this._connected = false;
            this.invalidate();
            alert(e);
        }, () => {
            this._connected = false;
            this.invalidate();
        });
    }

    protected render() {
        return v('div', {classes: this.classes(css.root)}, [
            this._connected ? this.renderConnected() : this.renderDisconnected()
        ]);
    }

    protected renderDisconnected() {
        let connecting = [];

        if (this._connecting) {
            connecting = [
                v('div', {classes: this.classes(css.connectionContainer)}, [
                    v('div', {classes: this.classes(css.loader)}, []),
                    v('div', {classes: this.classes(css.message)}, ['Connecting...'])
                ])
            ];
        } else {
            connecting = [
                v('div', {classes: this.classes(css.connectionContainer)}, [
                    v('div', {classes: this.classes(css.message)}, ['Click the heart to connect to your heart rate monitor.'])
                ])
            ];
        }

        return v('section', {key: 'disconnected', classes: this.classes(css.section)}, [
            ...connecting,
            v('div', {classes: this.classes(css.heart, css.clickable), onclick: this.connect}, [])
        ]);
    }

    protected renderConnected() {
        return v('section', {key: 'connected', classes: this.classes(css.section)}, [
            w(HeartRateDisplay, {heartRate: this._lastHeartRate}),
            w(EKGDisplay, { heartRate: this._lastHeartRate })
        ]);
    }
}

export default Application;
