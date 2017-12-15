import {v} from '@dojo/widget-core/d';
import {ThemeableMixin, theme} from '@dojo/widget-core/mixins/Themeable';
import {WidgetBase} from '@dojo/widget-core/WidgetBase';

import * as css from './styles/HelloWorld.m.css';
import HeartRateMonitor from "../services/HeartRateMonitor";

const monitor = new HeartRateMonitor();

@theme(css)
export class HelloWorld extends ThemeableMixin(WidgetBase) {
    private _lastHeartRate: number = 0;
    private _connected = false;

    constructor() {
        super();

        monitor.connected.subscribe(connected => {
            this._connected = connected;
            this.invalidate();
        });

        monitor.heartRate.subscribe(heartRate => {
            this._lastHeartRate = heartRate;
            this.invalidate();
        });
    }

    connect() {
        monitor.connect();
    }

    protected render() {
        return v('div', {classes: this.classes(css.root)}, [
            this._connected ? this.renderConnected() : this.renderDisconnected()
        ]);
    }

    protected renderDisconnected() {
        return v('section', { key: 'disconnected', classes: this.classes(css.section) }, [
            v('div', { classes: this.classes(css.heart) }, [
                v('button', {classes: this.classes(css.label, css.button), onclick: this.connect}, ['Connect'])
            ])
        ]);
    }

    protected renderConnected() {
        return v('section', { key: 'connected', classes: this.classes(css.section) }, [
            v('div', { classes: this.classes(css.heartRate) }, [
                String(this._lastHeartRate)
            ])
        ]);
    }
}

export default HelloWorld;
