const propertyHeaders = new Set(['propertyname', 'name', '\u5c5e\u6027\u540d']);
const descriptionHeaders = new Set(['description', 'desc', '\u63cf\u8ff0']);

const normalizeHeader = header => header.replaceAll(/\s/g, '').toLowerCase();

const isEscaped = (value, index) => {
    let slashCount = 0;

    for (let i = index - 1; i >= 0 && value[i] === '\\'; i -= 1) {
        slashCount += 1;
    }

    return slashCount % 2 === 1;
};

const normalizeCell = cell => cell.trim().replaceAll('\\|', '|');

const splitTableRow = line => {
    const value = line.trim();
    const start = value.startsWith('|') ? 1 : 0;
    const end = value.endsWith('|') && !isEscaped(value, value.length - 1) ? value.length - 1 : value.length;
    const cells = [];
    let cell = '';

    for (let i = start; i < end; i += 1) {
        const character = value[i];

        if (character === '|' && !isEscaped(value, i)) {
            cells.push(normalizeCell(cell));
            cell = '';
        } else {
            cell += character;
        }
    }

    cells.push(normalizeCell(cell));

    return cells;
};

const isTableRow = line => line.trim().startsWith('|');

const isAlignmentRow = cells => cells.every(cell => /^:?-{2,}:?$/.test(cell.trim()));

const getColumnIndex = (headers, headerSet) => {
    return headers.findIndex(header => headerSet.has(normalizeHeader(header)));
};

const isEmptyDescription = description => !description || description === '-';

const parseApiMarkdown = content => {
    const descriptions = new Map();
    const lines = content.split(/\r?\n/);
    let sectionName = '';

    for (let i = 0; i < lines.length; i += 1) {
        const sectionMatch = lines[i].match(/^###\s+(.+?)\s+Props\s*$/);

        if (sectionMatch) {
            sectionName = sectionMatch[1];
            continue;
        }

        if (!sectionName || !isTableRow(lines[i]) || !isTableRow(lines[i + 1] ?? '')) continue;

        const headers = splitTableRow(lines[i]);
        const alignment = splitTableRow(lines[i + 1]);

        if (!isAlignmentRow(alignment)) continue;

        const propertyIndex = getColumnIndex(headers, propertyHeaders);
        const descriptionIndex = getColumnIndex(headers, descriptionHeaders);

        if (propertyIndex === -1 || descriptionIndex === -1) continue;

        i += 2;

        for (; i < lines.length && isTableRow(lines[i]); i += 1) {
            const cells = splitTableRow(lines[i]);
            const propertyName = (cells[propertyIndex] ?? '').replace(/\*$/, '').trim();
            const description = (cells[descriptionIndex] ?? '').trim();

            if (propertyName && !isEmptyDescription(description)) {
                descriptions.set(`${sectionName}.${propertyName}`, description);
            }
        }

        i -= 1;
    }

    return descriptions;
};

export default parseApiMarkdown;
