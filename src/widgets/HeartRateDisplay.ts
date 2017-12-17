import {WidgetBase} from "@dojo/widget-core/WidgetBase";
import {ThemeableMixin} from "@dojo/widget-core/mixins/Themeable";
import * as css from './styles/HeartRateDisplay.m.css';
import {theme} from "@dojo/widget-core/main";
import {v} from "@dojo/widget-core/d";

export interface HeartRateDisplayProperties {
    heartRate: number;
}

@theme(css)
export class HeartRateDisplay extends ThemeableMixin(WidgetBase)<HeartRateDisplayProperties> {
    render() {
        return v('span', { classes: this.classes(css.heartRate) }, [String(this.properties.heartRate)]);
    }
}