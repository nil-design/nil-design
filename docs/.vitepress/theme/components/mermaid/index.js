export default md => {
    const fence = md.renderer.rules.fence;
    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx];

        if (token.info.trim() === 'mermaid') {
            return `<Mermaid code="${encodeURIComponent(token.content)}" />`;
        }

        return fence ? fence(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options);
    };
};
