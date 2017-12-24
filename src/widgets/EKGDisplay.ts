import WidgetBase from "@dojo/widget-core/WidgetBase";
import {ThemeableMixin, theme} from "@dojo/widget-core/mixins/Themeable";

import * as styles from './styles/EKGDisplay.m.css';
import {v} from "@dojo/widget-core/d";

export interface EKGDisplayProperties {
    heartRate: number;
}

@theme(styles)
export default class EKGDisplay extends ThemeableMixin(WidgetBase)<EKGDisplayProperties> {
    private values: number[] = [];
    private index = 0;
    private columns = 60;
    private frequency = 1000;

    tick() {
        if (this.properties.heartRate) {
            this.values[this.index] = this.properties.heartRate;
            this.index = (this.index + 1) % this.columns;
        }

        this.invalidate();

        setTimeout(this.tick.bind(this), this.frequency);
    }

    constructor() {
        super();

        this.tick();
    }

    render() {
        const children: any[] = [];

        const max = this.values.reduce((max, heartRate) => {
            return Math.max(max, heartRate);
        }, 0) * 1.05;
        const min = this.values.reduce((min, heartRate) => {
            return Math.min(min, heartRate);
        }, Number.MAX_VALUE) * 0.95;

        this.values.forEach((heartRate, index) => {
            const height = Math.round((heartRate - min) / (max - min) * 100);

            children.push(v('div', {
                key: `column-${index}`,
                classes: this.classes(styles.column, index === (this.index + this.columns - 1) % this.columns ? styles.active : null),
                styles: {
                    height: height + '%'
                }
            }));
        });

        return v('div', {classes: this.classes(styles.root)}, children);
    }
}