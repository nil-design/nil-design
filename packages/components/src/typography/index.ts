import Link from './Link';
import Paragraph from './Paragraph';
import Text from './Text';
import Title from './Title';
import TypographyComponent from './Typography';

/**
 * @category Components
 */
const Typography = Object.assign(TypographyComponent, {
    Link,
    Paragraph,
    Text,
    Title,
});

export type * from './interfaces';
export default Typography;
