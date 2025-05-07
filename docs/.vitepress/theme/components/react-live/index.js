import MarkdownItContainer from 'markdown-it-container';

export default md => {
    md.use(MarkdownItContainer, 'react-live', {
        validate: params => params.trim().match(/^react-live$/),
        render: (tokens, idx) => {
            let content = '';

            if (tokens[idx].type === 'container_react-live_open') {
                for (let jdx = idx + 1; tokens[jdx].type !== 'container_react-live_close'; jdx++) {
                    if (tokens[jdx].type === 'fence') {
                        content = tokens[jdx].content;
                        tokens[jdx].type = 'html_block';
                        tokens[jdx].content = '';
                    }
                }
            }

            if (content) {
                return `<ReactLive code="${encodeURIComponent(content)}" />`;
            }

            return '';
        },
    });
};
