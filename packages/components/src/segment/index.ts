import Item from './Item';
import SegmentComponent from './Segment';

/**
 * @category Components
 */
const Segment = Object.assign(SegmentComponent, {
    Item,
});

export type * from './interfaces';
export default Segment;
