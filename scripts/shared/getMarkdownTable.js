import { isEmpty, isString } from 'lodash-es';

/**
 * @param {Object} options
 * @param {(string | { text: string, align?: 'left' | 'center' | 'right' })[]} options.headers
 * @param {(string | { text: string, code?: boolean })[][]} options.rows
 * @returns {string}
 */
const getMarkdownTable = ({ headers, rows }) => {
    const normalize = cell => {
        if (isString(cell)) {
            return isEmpty(cell) ? '-' : cell.replaceAll('|', '\\|');
        }

        const { text, code } = cell;

        return isEmpty(text) ? '-' : (code ? `\`${text}\`` : text).replaceAll('|', '\\|');
    };
    const titles = headers.map(header => (isString(header) ? header : header.text));
    const alignments = headers.map(header => (isString(header) ? 'left' : (header.align ?? 'left')));
    const body = rows.map(row => row.map(cell => normalize(cell)));

    return [
        titles.join(' | '),
        alignments
            .map(alignment => (alignment === 'left' ? ':--' : alignment === 'center' ? ':-:' : '--:'))
            .join(' | '),
        ...body.map(row => row.join(' | ')),
    ]
        .map(line => `| ${line} |`)
        .join('\n');
};

export default getMarkdownTable;
