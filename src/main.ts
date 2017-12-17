import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import Application from './widgets/Application';

const Projector = ProjectorMixin(Application);
const projector = new Projector();

projector.append();
