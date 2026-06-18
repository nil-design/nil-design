import Grip from './Grip';
import Panel from './Panel';
import SplitterComponent from './Splitter';

/**
 * @category Components
 */
const Splitter = Object.assign(SplitterComponent, {
    Panel,
    Grip,
});

export type * from './interfaces';
export default Splitter;
