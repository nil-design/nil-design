class EmbeddingModel {
    constructor({
        id = 'Xenova/bge-small-en-v1.5',
        dtype = 'q8',
        pooling = 'mean',
        normalize = true,
        passagePrefix = '',
        queryPrefix = 'Represent this sentence for searching relevant passages: ',
    } = {}) {
        this._id = id;
        this.dtype = dtype;
        this.pooling = pooling;
        this.normalize = normalize;
        this.passagePrefix = passagePrefix;
        this.queryPrefix = queryPrefix;
    }

    get id() {
        return this._id;
    }

    get key() {
        return `${this._id}::${this.dtype}`;
    }

    toJSON() {
        return {
            id: this._id,
            dtype: this.dtype,
            pooling: this.pooling,
            normalize: this.normalize,
            passagePrefix: this.passagePrefix,
            queryPrefix: this.queryPrefix,
        };
    }
}

const getEmbeddingModel = locale => {
    if (locale === 'zh-CN') {
        return new EmbeddingModel({
            id: 'Xenova/bge-small-zh-v1.5',
            queryPrefix:
                '\u4e3a\u8fd9\u4e2a\u53e5\u5b50\u751f\u6210\u8868\u793a\u4ee5\u7528\u4e8e\u68c0\u7d22\u76f8\u5173\u6587\u7ae0\uff1a',
        });
    }

    if (locale === 'en-US') {
        return new EmbeddingModel({
            id: 'Xenova/bge-small-en-v1.5',
            queryPrefix: 'Represent this sentence for searching relevant passages: ',
        });
    }

    throw new Error(`No embedding model configured for locale "${locale}".`);
};

export { EmbeddingModel, getEmbeddingModel };
export default getEmbeddingModel;
