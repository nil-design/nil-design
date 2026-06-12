import Range from './Range';
import SliderComponent from './Slider';
import Thumb from './Thumb';
import Track from './Track';

/**
 * @category Components
 */
const Slider = Object.assign(SliderComponent, {
    Track,
    Range,
    Thumb,
});

export type * from './interfaces';
export default Slider;
