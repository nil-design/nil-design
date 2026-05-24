import List from './List';
import Panel from './Panel';
import Tab from './Tab';
import TabsComponent from './Tabs';

/**
 * @category Components
 */
const Tabs = Object.assign(TabsComponent, {
    List,
    Tab,
    Panel,
});

export type * from './interfaces';
export default Tabs;
